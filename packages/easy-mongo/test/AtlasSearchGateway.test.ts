import { lucene, MongoProvider, SearchDefinition, stages } from '../src';
import { toPageList } from '@thisisagile/easy';
import { DevCollection } from './ref/DevCollection';
import { mock } from '@thisisagile/easy-test';
import { AtlasSearchGateway } from '../src/AtlasSearchGateway';

const { searchWithDef, searchMeta, facet } = lucene;
const { skip, take } = stages.skip;
const { replaceWith } = stages.replaceWith;

describe('AtlasSearchGateway', () => {
  let provider: MongoProvider;
  let collection: DevCollection;
  let gateway: AtlasSearchGateway;
  const def: SearchDefinition = {
    // @ts-ignore
    q: v => ({ should: { wildcard: lucene.text(v) } }),
    // @ts-ignore
    language: () => ({ facet: facet.string('language') }),
  };
  const results = toPageList([{ _id: { shopId: 42 } }]);

  beforeEach(() => {
    collection = new DevCollection();
    provider = mock.a<MongoProvider>({ aggregate: mock.resolve(results) });
    gateway = new AtlasSearchGateway(collection, provider, def);
  });

  test('query', async () => {
    const query = { q: 'manea' };
    await expect(gateway.query(query)).resolves.toMatchJson(toPageList(results));
    expect(provider.aggregate).toHaveBeenNthCalledWith(1, [searchWithDef(query, def), skip({ skip: 0 }), take({ take: 250 })]);
    expect(provider.aggregate).toHaveBeenNthCalledWith(2, [
      searchMeta(query, def),
      replaceWith({
        total: '$count.lowerBound',
        facets: { language: '$facet.language.buckets' },
      }),
    ]);
  });
});
