import { asString, ctx, Exception, Id, isDefined, Json, JsonValue, List, toList } from '../types';
import { Collection as MongoCollection, FilterQuery, MongoClient } from 'mongodb';
import { when } from '../validation';
import { Condition } from './Condition';
import { Field } from './Field';
import { Database } from '../data';

const clearMongoId = (i: Json): Json => {
  if (isDefined(i)) delete i._id;
  return i;
};

export class MongoProvider {
  constructor(readonly db: Database, private client?: Promise<MongoClient>) {}

  connect(db: Database): Promise<MongoClient> {
    return when(ctx.env.get('mongodbCluster'))
      .not.isDefined.reject(Exception.EnvironmentVariableNotFound('MONGODB_CLUSTER'))
      .then(u =>
        new MongoClient(u, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          auth: { user: asString(db.options?.user), password: asString(db.options?.password) },
          // user: ctx.env.get('mongodbUser', 'admin') as string,
          // password: ctx.env.get('mongodbPassword', 'admin') as string,
        }).connect()
      );
  }

  find(query: Condition | FilterQuery<any>, limit = 250): Promise<List<Json>> {
    return this.collection()
      .then(c => c.find(query, { limit }))
      .then(res => res.toArray())
      .then(res => res.map(i => clearMongoId(i)))
      .then(res => toList(res));
  }

  all(limit = 250): Promise<List<Json>> {
    return this.find({}, limit);
  }

  byId(id: Id): Promise<Json> {
    return this.collection()
      .then(c => c.findOne({ id: id.toString() }))
      .then(i => clearMongoId(i));
  }

  by(key: string, value: JsonValue): Promise<List<Json>> {
    return this.find({ [key]: asString(value) });
  }

  group(qs: FilterQuery<any>[]): Promise<Json[]> {
    return this.collection()
      .then(c => c.aggregate(qs))
      .then(res => res.toArray());
  }

  add(o: Json): Promise<Json> {
    return this.collection()
      .then(c => c.insertOne(clearMongoId(o)))
      .then(i => clearMongoId(i.ops[0]));
  }

  update(item: Json): Promise<Json> {
    return this.collection()
      .then(c => c.updateOne({ id: item.id }, { $set: clearMongoId(item) }))
      .then(() => this.byId(item.id as Id));
  }

  remove(id: Id): Promise<boolean> {
    return this.collection()
      .then(c => c.deleteOne({ id: id.toString() }))
      .then(d => d.result.ok === 1);
  }

  createIndex(field: string | any, unique = true): Promise<string> {
    return this.collection().then(c => c.createIndex(field, { unique, w: 1 }));
  }

  createTextIndexes(...fields: Field[]): Promise<string> {
    const indexes = fields.reduce((i, f) => ({ ...i, [f.name]: 'text' }), {});
    return this.collection().then(c => c.createIndex(indexes));
  }

  count(query?: Condition | FilterQuery<any>): Promise<number> {
    return this.collection().then(c => c.countDocuments(query));
  }

  collection(): Promise<MongoCollection> {
    return (this.client ?? (this.client = this.connect(this.db))).then(c => c.db(ctx.env.domain)).then(db => db.collection(asString(this.db)));
  }
}
