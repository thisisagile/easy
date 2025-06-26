import { AtlasSearchGateway, lucene, MongoProvider, SearchDefinition, stages } from '../src';
import { Filter, resolve, toPageList } from '@thisisagile/easy';
import { DevCollection } from './ref/DevCollection';
import { mock } from '@thisisagile/easy-test';

const { searchWithDef, searchMeta, facet } = lucene;
const { skip, take } = stages.skip;
const { replaceWith } = stages.replaceWith;
const { include } = stages.project;

describe('AtlasSearchGateway', () => {
  let provider: MongoProvider;
  let collection: DevCollection;
  let gateway: AtlasSearchGateway;
  const def: SearchDefinition = {
    q: v => ({ should: { wildcard: lucene.text(v) } }),
    language: () => ({ facet: facet.string('language') }),
  };
  const results = toPageList([{ _id: { shopId: 42 } }]);

  beforeEach(() => {
    collection = new DevCollection();
    provider = mock.a<MongoProvider>({ aggregate: mock.resolve(results) });
    gateway = new AtlasSearchGateway(collection, def, {}, provider);
  });

  test('query', async () => {
    const query = { q: 'manea' };
    await expect(gateway.query(query)).resolves.toMatchJson(toPageList(results));
    expect(provider.aggregate).toHaveBeenNthCalledWith(1, [searchWithDef(query, def), skip({ skip: 0 }), take({ take: 250 })]);
    expect(provider.aggregate).toHaveBeenNthCalledWith(2, [
      searchMeta(query, def),
      replaceWith({
        total: '$count.total',
        facets: { language: '$facet.language.buckets' },
      }),
    ]);
  });

  test('query with additional stages', async () => {
    const query = { q: 'manea' };
    await expect(gateway.query(query, [include({}) as Filter])).resolves.toMatchJson(toPageList(results));
    expect(provider.aggregate).toHaveBeenNthCalledWith(1, [searchWithDef(query, def), skip({ skip: 0 }), take({ take: 250 }), { $project: {} }]);
    expect(provider.aggregate).toHaveBeenNthCalledWith(2, [
      searchMeta(query, def),
      replaceWith({
        total: '$count.total',
        facets: { language: '$facet.language.buckets' },
      }),
    ]);
  });

  test('facets work', async () => {
    const query = { q: 'manea', skip: 12, take: 6 };
    provider.aggregate = mock.once(
      resolve(results),
      resolve(
        toPageList([
          {
            facets: {
              language: [
                {
                  _id: 'java',
                  count: 42,
                },
              ],
            },
            total: 55,
          },
        ])
      )
    );
    const actual = await gateway.query(query);
    expect(actual).toMatchJson(toPageList(results));
    expect(actual.options).toEqual({
      total: 55,
      filters: [{ label: 'Language', field: 'language', values: [{ label: 'java', value: 'java', count: 42 }] }],
      sorts: [],
      skip: 12,
      take: 6,
    });
    expect(provider.aggregate).toHaveBeenCalledTimes(2);
  });
});
