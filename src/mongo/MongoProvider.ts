import { ctx, Id, isDefined, Json, JsonValue, List, toList, toString } from '../types';
import { Collection, FilterQuery, MongoClient } from 'mongodb';
import { when } from '../validation';

const clearMongoId = (i: Json): Json => {
  if (isDefined(i)) delete i._id;
  return i;
};

export class MongoProvider {
  constructor(readonly collectionName: string, private readonly client: Promise<MongoClient> = MongoProvider.setup()) {}

  static setup(): Promise<MongoClient> {
    return when(ctx.env.get('mongodbCluster'))
      .not.isDefined.reject('Environment variable MONGODB_CLUSTER not set!')
      .then(u =>
        new MongoClient(u, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          auth: { user: ctx.env.get('mongodbUser') ?? 'admin', password: ctx.env.get('mongodbPassword') ?? 'admin' },
        }).connect()
      );
  }

  find(query: FilterQuery<any>, limit = 250): Promise<List<Json>> {
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
    return this.find({ [key]: toString(value) });
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

  count(): Promise<number> {
    return this.collection().then(c => c.countDocuments());
  }

  collection(): Promise<Collection> {
    return this.client.then(c => c.db(ctx.env.domain)).then(db => db.collection(this.collectionName));
  }
}
