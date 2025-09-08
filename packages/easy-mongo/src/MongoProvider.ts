import {
  asJson,
  asNumber,
  asString,
  choose,
  Condition,
  Database,
  entries,
  Exception,
  FetchOptions,
  Field,
  Id,
  ifTrue,
  isArray,
  isDefined,
  isField,
  isSortCondition,
  json,
  Json,
  JsonValue,
  LogicalCondition,
  OneOrMore,
  PageList,
  Sort,
  toArray,
  toPageList,
  tuple2,
  tuple3,
  use,
  when,
} from '@thisisagile/easy';
import {
  AggregationCursor,
  Collection as MongoCollection,
  CreateIndexesOptions,
  Document,
  FindCursor,
  FindOptions as MongoFindOptions,
  IndexSpecification,
  MongoClient,
  StrictFilter as MongoFilter,
} from 'mongodb';
import { Collection } from './Collection';
import { toMongoType } from './Utils';

const omitId = (j: Json): Json => json.delete(j, '_id');

export type Projection = Record<string, 0 | 1>;
export type FindOptions = FetchOptions & { projection?: Projection };
export type Filter<T = unknown> = MongoFilter<T>;
export type Query = Condition | LogicalCondition | Filter<any>;

export type IndexOptions = {
  unique?: boolean;
  filter?: Query;
  languageOverride?: string;
  languageDefault?: string;
};

export type Indexes = OneOrMore<string | Field | Sort | Record<string, 1 | -1>>;

export type Options = { maxTimeMS?: number };

function omitOptions(obj?: FindOptions & Options): Omit<FindOptions & Options, keyof Options> {
  const { maxTimeMS, ...rest } = obj ?? ({} as Options);
  return rest;
}

export class MongoProvider {
  protected static readonly clients: { [key: string]: Promise<MongoClient> } = {};

  constructor(readonly coll: Collection) {}

  static destroyAll(): Promise<void> {
    return Promise.all(entries(MongoProvider.clients).map(([u, c]) => c.then(c => c.close()).then(() => delete MongoProvider.clients[u]))).then(
      () => undefined
    );
  }

  private static connect(u: string, db: Database) {
    return MongoClient.connect(u, {
      auth: {
        username: asString(db.options?.user),
        password: asString(db.options?.password),
      },
      ...(db.options?.maxPoolSize && { maxPoolSize: db.options?.maxPoolSize }),
      ...(db.options?.minPoolSize && { minPoolSize: db.options?.minPoolSize }),
      ...(db.options?.maxIdleTimeMS && { maxIdleTimeMS: db.options?.maxIdleTimeMS }),
      ...(db.options?.socketTimeoutMS && { socketTimeoutMS: db.options?.socketTimeoutMS }),
    })
      .then(c => {
        c.on('error', () => delete MongoProvider.clients[u]);
        c.on('close', () => delete MongoProvider.clients[u]);
        return c;
      })
      .catch(err => {
        delete MongoProvider.clients[u];
        return Promise.reject(err);
      });
  }

  cluster(): Promise<MongoClient> {
    return use(this.coll.db, db =>
      when(db.options?.cluster)
        .not.isDefined.reject(Exception.IsNotValid.because('Missing cluster in database options.'))
        .then(c => MongoProvider.clients[c] ?? (MongoProvider.clients[c] = MongoProvider.connect(c, db)))
    );
  }

  collection<T extends Document = Document>(): Promise<MongoCollection<T>> {
    return this.cluster()
      .then(c => c.db(this.coll.db.name))
      .then(db => db.collection<T>(asString(this.coll)));
  }

  toMongoJson(query: Query): Json {
    return toMongoType(asJson(query));
  }

  withTimeout(options?: Partial<FindOptions & Options>): Partial<FindOptions> & Options {
    return { ...options, maxTimeMS: options?.maxTimeMS ?? this.coll.db?.options?.queryTimeoutMS ?? 5000 };
  }

  find(query: Query, options?: FindOptions & Options): Promise<PageList<Json>> {
    return tuple3(this.collection(), this.toMongoJson(query), this.toFindOptions(options))
      .then(([c, q, o]) =>
        tuple2(
          c.find(q, o),
          ifTrue(o.total, () => c.countDocuments(q, { maxTimeMS: this.withTimeout(options).maxTimeMS }))
        )
      )
      .then(([res, total]) => this.toArray(res, { ...omitOptions(options), total }));
  }

  all(options?: FindOptions): Promise<PageList<Json>> {
    return this.find({}, options);
  }

  byId(id: Id, options?: FindOptions): Promise<Json> {
    return this.collection().then(c => c.findOne(this.toMongoJson({ id: id }), this.toFindOptions(options)) as Promise<Json>);
  }

  by(key: string, value: JsonValue, options?: FindOptions): Promise<PageList<Json>> {
    return this.find({ [key]: value }, options);
  }

  group(qs: Filter<any>[], options?: Options): Promise<PageList<Json>> {
    return this.aggregate(qs, options);
  }

  aggregate(qs: Filter<any>[], options?: Options): Promise<PageList<Json>> {
    return this.collection()
      .then(c =>
        c.aggregate(
          qs.map(q => this.toMongoJson(q)),
          this.withTimeout(options)
        )
      )
      .then(res => this.toArray(res));
  }

  add(item: Json): Promise<Json> {
    return this.collection()
      .then(c => c.insertOne(omitId(item)))
      .then(() => omitId(item));
  }

  update(item: Json): Promise<Json> {
    return this.collection()
      .then(c => c.updateOne(this.toMongoJson({ id: item.id }), { $set: omitId(item) }))
      .then(() => this.byId(item.id as Id));
  }

  remove(id: Id): Promise<boolean> {
    return this.collection()
      .then(c => c.deleteOne(this.toMongoJson({ id })))
      .then(d => d.acknowledged);
  }

  count(query?: Query, options?: Options): Promise<number> {
    return this.collection().then(c => c.countDocuments(this.toMongoJson(query ?? {}), this.withTimeout(options)));
  }

  createIndex(indexes: Indexes, options?: IndexOptions): Promise<string> {
    return this.collection().then(c => c.createIndex(this.toIndexSpecification(indexes), this.toCreateIndexesOptions(options)));
  }

  createPartialIndex(indexes: Indexes, filter: Query, options?: Omit<IndexOptions, 'filter'>): Promise<string> {
    return this.createIndex(indexes, { ...options, filter });
  }

  createTextIndex(indexes: OneOrMore<Field | string>, options?: IndexOptions): Promise<string> {
    const ii = toArray(indexes).reduce((i, f) => ({ ...i, [asString(f)]: 'text' }), {});
    return this.createIndex(ii, { unique: false, ...options });
  }

  protected toFindOptions(options?: FindOptions): MongoFindOptions & { total: boolean } {
    return {
      limit: asNumber(options?.take ?? 250),
      ...(options?.skip && { skip: asNumber(options?.skip) }),
      ...((options?.sorts && { sort: options?.sorts }) || (options?.sort && { sort: this.coll.sort(...(options?.sort ?? [])) })),
      total: isDefined(options?.skip) || isDefined(options?.take),
      projection: options?.projection ?? { _id: 0 },
      maxTimeMS: this.withTimeout(options).maxTimeMS,
    };
  }

  protected toIndexSpecification(index: Indexes): IndexSpecification {
    return choose(index)
      .type(isField, f => f.property as IndexSpecification)
      .type(isSortCondition, s => s.toJSON() as IndexSpecification)
      .type(isArray, aa => aa.map(a => this.toIndexSpecification(a)) as IndexSpecification)
      .else(i => i as IndexSpecification);
  }

  protected toCreateIndexesOptions(options?: IndexOptions): CreateIndexesOptions {
    return {
      unique: options?.unique ?? true,
      ...(options?.languageOverride && { language_override: options.languageOverride }),
      ...(options?.languageDefault && { default_language: options.languageDefault }),
      ...(options?.filter && { partialFilterExpression: toMongoType(asJson(options.filter)) }),
    };
  }

  protected toArray(
    cursor: FindCursor<Document> | AggregationCursor<Document>,
    options?: { take?: number; skip?: number; total?: number }
  ): Promise<PageList<Json>> {
    return cursor.toArray().then(r => toPageList<Json>(r, options));
  }
}
