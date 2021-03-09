import { ctx, Exception, Id, isDefined, Json, JsonValue, List, toList } from '../types';
import { Collection, FilterQuery, MongoClient } from 'mongodb';
import { when } from '../validation';
import { reject } from '../utils';

const clearMongoId = (i: Json): Json => {
  if (isDefined(i)) delete i._id;
  return i;
};

export class MongoProvider {
  constructor(readonly collectionName: string, private readonly client: Promise<MongoClient> = MongoProvider.setup()) {}

  private static mongoUrl(): Promise<string> {
    return when(ctx.env.get('mongodbCluster')).not.isDefined.reject('Environment variable MONGODB_CLUSTER not set!');
  }

  private static setup(): Promise<MongoClient> {
    return MongoProvider.mongoUrl().then(u =>
      new MongoClient(u, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: { user: ctx.env.get('mongodbUser'), password: ctx.env.get('mongodbPassword') },
      }).connect()
    );
  }

  find(query?: FilterQuery<any>, limit = 250): Promise<List<Json>> {
    return this.collection()
      .then(c => c.find(query, { limit }))
      .then(res => res.toArray())
      .then(res => res.map(i => clearMongoId(i)))
      .then(res => toList(res));
  }

  all(limit = 250): Promise<List<Json>> {
    return this.find(undefined, limit);
  }

  byId(id: Id): Promise<Json> {
    return this.collection()
      .then(c => c.findOne({ id: id.toString() }))
      .then(i => clearMongoId(i));
  }

  by(key: string, value: JsonValue): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented.because(`Search for key '${key}' and '${value}' is not implemented yet. `));
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
