import { stages } from './Stages';
import { MongoGateway } from './MongoGateway';
import { Collection } from './Collection';
import { MongoProvider } from './MongoProvider';
import { lucene, SearchDefinition } from './Lucene';
import { asNumber, entries, Filter, Json, PageList, text, toPageList, tuple2 } from '@thisisagile/easy';
import { Filter as MongoFilter} from '../src/MongoProvider';

const { skip, take } = stages.skip;
const { replaceWith } = stages.replaceWith;
const { searchWithDef, searchMeta, facets } = lucene;

type FacetResult = { _id: string; count: number };
type Value = { label: string; value: string; count: number };
export const toFilters = (facets: unknown): Filter[] =>
  entries(facets as Record<string, unknown>).map(([k, fs]) => ({
    label: text(k).title.toString(),
    field: k,
    values: (fs as []).map((f: FacetResult) => toValue(f)),
  }));

const toValue = (f: FacetResult): Value => ({ label: f._id ?? 'unknown', value: f._id ?? 'unknown', count: f.count });

export class AtlasSearchGateway extends MongoGateway {
  constructor(
    collection: Collection,
    readonly searchDef: SearchDefinition,
    readonly sortDef: Record<string, Record<string, 1 | -1>> = {},
    provider: MongoProvider = collection.provider
  ) {
    super(collection, provider);
  }

  query(query: Record<keyof typeof this.searchDef, string | number>, additionalStages: MongoFilter[] = []): Promise<PageList<Json>> {
    return tuple2(
      this.aggregate(
        searchWithDef(query, this.searchDef),
        skip({ skip: (query?.skip as number) ?? 0 }),
        take({ take: (query?.take as number) ?? 250 }),
        ...additionalStages
      ),
      this.aggregate(
        searchMeta(query, this.searchDef),
        replaceWith({
          total: '$count.total',
          facets: Object.keys(facets(this.searchDef)).reduce((acc, k) => ({ ...acc, [k]: `$facet.${k}.buckets` }), {}),
        })
      )
    )
      .then(([data, meta]) => ({ data, meta: meta.first() }))
      .then(({ data, meta }) =>
        toPageList<Json>(data, {
          total: asNumber(meta?.total, 0),
          skip: asNumber(query?.skip, 0),
          take: asNumber(query?.take, 250),
          sorts: Object.keys(this.sortDef),
          filters: toFilters(meta.facets),
        })
      );
  }
}
