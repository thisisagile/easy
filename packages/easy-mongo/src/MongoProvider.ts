import {
    asJson,
    asString,
    choose,
    Condition,
    Database,
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
    reject,
    Sort,
    toArray,
    toPageList,
    tuple2,
    tuple3,
    when,
} from '@thisisagile/easy';
import {
    AggregationCursor,
    Collection as MongoCollection,
    CreateIndexesOptions,
    Document,
    Filter as MongoFilter,
    FindCursor,
    FindOptions as MongoFindOptions,
    IndexSpecification,
    MongoClient,
} from 'mongodb';
import {Collection} from './Collection';
import {toMongoType} from './Utils';

const omitId = (j: Json): Json => json.delete(j, '_id');

export type Projection = Record<string, 0 | 1>;
export type FindOptions = FetchOptions & { projection?: Projection };
export type Filter<T> = MongoFilter<T>;
export type Query = Condition | LogicalCondition | Filter<any>;

export type IndexOptions = {
    unique?: boolean;
    filter?: Query;
    languageOverride?: string;
    languageDefault?: string;
};

export type Indexes = OneOrMore<string | Field | Sort | Record<string, 1 | -1>>;

export class MongoProvider {
    protected static readonly clients: { [key: string]: Promise<MongoClient> } = {};
    aggregate = this.group;

    constructor(readonly coll: Collection, protected client?: Promise<MongoClient>) {
    }

    static client(db: Database): Promise<MongoClient> {
        return when(db.options?.cluster)
            .not.isDefined.reject(Exception.IsNotValid.because('Missing cluster in database options.'))
            .then(
                u =>
                    (MongoProvider.clients[u] = MongoProvider.clients[u] ??
                        MongoClient.connect(u, {
                            auth: {
                                username: asString(db.options?.user),
                                password: asString(db.options?.password),
                            },
                            ...(db.options?.maxPoolSize && {maxPoolSize: db.options?.maxPoolSize}),
                            ...(db.options?.minPoolSize && {minPoolSize: db.options?.minPoolSize}),
                            ...(db.options?.maxIdleTimeMS && {maxIdleTimeMS: db.options?.maxIdleTimeMS}),
                        }))
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

    toMongoJson(query: Query): Json {
        return toMongoType(asJson(query));
    }

    find(query: Query, options?: FindOptions): Promise<PageList<Json>> {
        return tuple3(this.collection(), this.toMongoJson(query), this.toFindOptions(options))
            .then(([c, q, o]) =>
                tuple2(
                    c.find(q, o),
                    ifTrue(o.total, () => c.countDocuments(q))
                )
            )
            .then(([res, total]) => this.toArray(res, options && {total}));
    }

    all(options?: FindOptions): Promise<PageList<Json>> {
        return this.find({}, options);
    }

    byId(id: Id, options?: FindOptions): Promise<Json> {
        return this.collection().then(c => c.findOne(this.toMongoJson({id: asString(id)}), this.toFindOptions(options)) as Promise<Json>);
    }

    by(key: string, value: JsonValue, options?: FindOptions): Promise<PageList<Json>> {
        return this.find({[key]: asString(value)}, options);
    }

    group(qs: Filter<any>[]): Promise<PageList<Json>> {
        return this.collection()
            .then(c => c.aggregate(qs.map(q => this.toMongoJson(q))))
            .then(res => this.toArray(res));
    }

    add(item: Json): Promise<Json> {
        return this.collection()
            .then(c => c.insertOne(omitId(item)))
            .then(() => omitId(item));
    }

    update(item: Json): Promise<Json> {
        return this.collection()
            .then(c => c.updateOne(this.toMongoJson({id: item.id}), {$set: omitId(item)}))
            .then(() => this.byId(item.id as Id));
    }

    remove(id: Id): Promise<boolean> {
        return this.collection()
            .then(c => c.deleteOne(this.toMongoJson({id})))
            .then(d => d.acknowledged);
    }

    count(query?: Query): Promise<number> {
        return this.collection().then(c => c.countDocuments(this.toMongoJson(query ?? {})));
    }

    createIndex(indexes: Indexes, options?: IndexOptions): Promise<string> {
        return this.collection().then(c => c.createIndex(this.toIndexSpecification(indexes), this.toCreateIndexesOptions(options)));
    }

    createPartialIndex(indexes: Indexes, filter: Query, options?: Omit<IndexOptions, 'filter'>): Promise<string> {
        return this.createIndex(indexes, {...options, filter});
    }

    createTextIndex(indexes: OneOrMore<Field | string>, options?: IndexOptions): Promise<string> {
        const ii = toArray(indexes).reduce((i, f) => ({...i, [asString(f)]: 'text'}), {});
        return this.createIndex(ii, {unique: false, ...options});
    }

    collection(): Promise<MongoCollection> {
        return this.cluster()
            .then(c => c.db(this.coll.db.name))
            .then(db => db.collection(asString(this.coll)));
    }

    protected toFindOptions(options?: FindOptions): MongoFindOptions & { total: boolean } {
        return {
            limit: options?.take ?? 250,
            ...(options?.skip && {skip: options?.skip}),
            ...(options?.sort && {sort: this.coll.sort(...(options?.sort ?? {})) as any}),
            total: isDefined(options?.skip) || isDefined(options?.take),
            projection: options?.projection ?? {_id: 0},
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
            ...(options?.languageOverride && {language_override: options.languageOverride}),
            ...(options?.languageDefault && {default_language: options.languageDefault}),
            ...(options?.filter && {partialFilterExpression: toMongoType(asJson(options.filter))}),
            writeConcern: {w: 1},
        };
    }

    protected toArray(
        cursor: FindCursor<Document> | AggregationCursor<Document>,
        options?: { take?: number; skip?: number; total?: number }
    ): Promise<PageList<Json>> {
        return cursor.toArray().then(r => toPageList<Json>(r, options));
    }
}
