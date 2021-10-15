import {
  asJson,
  asString,
  Condition,
  Database,
  Exception,
  Field,
  Id,
  isDefined,
  Json,
  JsonValue,
  List,
  LogicalCondition,
  toList,
  when,
} from '@thisisagile/easy';
import { Collection as MongoCollection, FilterQuery, MongoClient } from 'mongodb';
import { Collection } from './Collection';
import { toMongoType } from './Utils';

const omitId = (j: Json): Json => {
  if (isDefined(j)) delete j._id;
  return j;
};

export type FindOptions = {
  limit?: number;
  skip?: number;
};

export class MongoProvider {
  constructor(readonly coll: Collection, private client?: Promise<MongoClient>) {}

  static cluster(db: Database): Promise<MongoClient> {
    return when(db.options?.cluster)
      .not.isDefined.reject(new Exception('Missing cluster in database options.'))
      .then(u =>
        new MongoClient(u, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          auth: { user: asString(db.options?.user), password: asString(db.options?.password) },
        }).connect()
      );
  }

  find(query: Condition | LogicalCondition | FilterQuery<any>, options: FindOptions = { limit: 250 }): Promise<List<Json>> {
    return this.collection()
      .then(c => c.find(toMongoType(asJson(query)), { ...options, limit: options.limit ?? 250 }))
      .then(res => res.toArray())
      .then(res => res.map(i => omitId(i)))
      .then(res => toList(res));
  }

  all(options?: FindOptions): Promise<List<Json>> {
    return this.find({}, options);
  }

  byId(id: Id): Promise<Json> {
    return this.collection()
      .then(c => c.findOne({ id: asString(id) }))
      .then(i => omitId(i));
  }

  by(key: string, value: JsonValue, options?: FindOptions): Promise<List<Json>> {
    return this.find({ [key]: asString(value) }, options);
  }

  group(qs: FilterQuery<any>[]): Promise<Json[]> {
    return this.collection()
      .then(c => c.aggregate(qs))
      .then(res => res.toArray());
  }

  add(o: Json): Promise<Json> {
    return this.collection()
      .then(c => c.insertOne(omitId(o)))
      .then(i => omitId(i.ops[0]));
  }

  update(item: Json): Promise<Json> {
    return this.collection()
      .then(c => c.updateOne({ id: item.id }, { $set: omitId(item) }))
      .then(() => this.byId(item.id as Id));
  }

  remove(id: Id): Promise<boolean> {
    return this.collection()
      .then(c => c.deleteOne({ id }))
      .then(d => d.result.ok === 1);
  }

  count(query?: Condition | LogicalCondition | FilterQuery<any>): Promise<number> {
    return this.collection().then(c => c.countDocuments(query));
  }

  createIndex(field: string | any, unique = true): Promise<string> {
    return this.collection().then(c => c.createIndex(field, { unique, writeConcern: { w: 1 } }));
  }

  createPartialIndex(field: string | any, filter: Condition | LogicalCondition | FilterQuery<any>, unique = true): Promise<string> {
    return this.collection().then(c => c.createIndex(field, { partialFilterExpression: asJson(filter), unique, writeConcern: { w: 1 } }));
  }

  createTextIndexes(...fields: Field[]): Promise<string> {
    const indexes = fields.reduce((i, f) => ({ ...i, [f.property]: 'text' }), {});
    return this.collection().then(c => c.createIndex(indexes));
  }

  collection(): Promise<MongoCollection> {
    return Promise.resolve()
      .then(() => this.client ?? (this.client = MongoProvider.cluster(this.coll.db)))
      .then(c => c.db(this.coll.db.name))
      .then(db => db.collection(asString(this.coll)));
  }
}
