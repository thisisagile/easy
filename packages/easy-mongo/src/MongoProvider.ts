import {
  asJson,
  asString,
  Condition,
  Database,
  Exception,
  Field,
  Id,
  isDefined, json,
  Json,
  JsonValue,
  LogicalCondition,
  PageList,
  PageOptions,
  reject,
  toPageList,
  when,
} from '@thisisagile/easy';
import { Collection as MongoCollection, Filter as MongoFilter, FindOptions, MongoClient } from 'mongodb';
import { Collection } from './Collection';
import { toMongoType } from './Utils';

const omitId = (j: Json): Json => json.delete(j, '_id');
//
// {
//   if (isDefined(j)) delete j._id;
//   return j;
// };

const toFindOptions = (coll: Collection, po?: PageOptions): FindOptions & { total: boolean } => ({
  limit: po?.take ?? 250,
  skip: po?.skip,
  sort: coll.sort(...(po?.sort ?? [])) as any,
  total: isDefined(po?.skip) || isDefined(po?.take),
});

export type Filter<T> = MongoFilter<T>;

export class MongoProvider {
  aggregate = this.group;

  constructor(readonly coll: Collection, private client?: Promise<MongoClient>) {
  }

  static client(db: Database): Promise<MongoClient> {
    return when(db.options?.cluster)
      .not.isDefined.reject(Exception.IsNotValid.because('Missing cluster in database options.'))
      .then(
        u =>
          new MongoClient(u, {
            auth: {
              username: asString(db.options?.user),
              password: asString(db.options?.password),
            },
          }),
      );
  }

  cluster(): Promise<MongoClient> {
    return Promise.resolve()
      .then(() => this.client ?? (this.client = MongoProvider.client(this.coll.db)))
      .catch(e => {
        this.client = undefined;
        return reject(e);
      });
  }

  toMongoJson(query: Condition | LogicalCondition | Filter<any>): Json {
    return toMongoType(asJson(query));
  }

  find(query: Condition | LogicalCondition | Filter<any>, options?: PageOptions): Promise<PageList<Json>> {
    return this.collection()
      .then(c => c.find(this.toMongoJson(query), toFindOptions(this.coll, options)))
      .then(res => res.toArray())
      .then(res => res.map(i => omitId(i)))
      .then(res => toPageList(res, options));
  }

  all(options?: PageOptions): Promise<PageList<Json>> {
    return this.find({}, options);
  }

  byId(id: Id): Promise<Json> {
    return this.collection()
      .then(c => c.findOne(this.toMongoJson({ id: asString(id) })))
      .then(i => omitId(i as Json));
  }

  by(key: string, value: JsonValue, options?: PageOptions): Promise<PageList<Json>> {
    return this.find({ [key]: asString(value) }, options);
  }

  group(qs: Filter<any>[]): Promise<PageList<Json>> {
    return this.collection()
      .then(c => c.aggregate(qs.map(q => this.toMongoJson(q))))
      .then(res => res.toArray())
      .then(res => toPageList( res ));
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

  count(query?: Condition | LogicalCondition | Filter<any>): Promise<number> {
    return this.collection().then(c => c.countDocuments(this.toMongoJson(query ?? {})));
  }

  createIndex(field: string | any, unique = true): Promise<string> {
    return this.collection().then(c => c.createIndex(field, { unique, writeConcern: { w: 1 } }));
  }

  createPartialIndex(field: string | any, filter: Condition | LogicalCondition | Filter<any>, unique = true): Promise<string> {
    return this.collection().then(c =>
      c.createIndex(field, {
        partialFilterExpression: toMongoType(asJson(filter)),
        unique,
        writeConcern: { w: 1 },
      }),
    );
  }

  createTextIndexes(...fields: Field[]): Promise<string> {
    const indexes = fields.reduce((i, f) => ({ ...i, [f.property]: 'text' }), {});
    return this.collection().then(c => c.createIndex(indexes));
  }

  collection(): Promise<MongoCollection> {
    return this.cluster()
      .then(c => c.connect())
      .then(c => c.db(this.coll.db.name))
      .then(db => db.collection(asString(this.coll)));
  }
}
