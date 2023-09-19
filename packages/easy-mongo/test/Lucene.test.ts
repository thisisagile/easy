import '@thisisagile/easy-test';
import { lucene, SearchDefinition } from '../src';
import { toList } from '@thisisagile/easy';

describe('Lucene', () => {
  // Operations

  const { text, wildcard, lt, lte, gt, gte, before, after, between, search, clauses, exists, facet, searchWithDef } = lucene;

  test('text undefined', () => {
    const t = text(undefined)('size');
    expect(t).toBeUndefined();
  });

  test('text single value', () => {
    const t = text('42')('size');
    expect(t).toStrictEqual({ text: { path: 'size', query: '42' } });
  });

  test('text multiple values', () => {
    const t = text(['42', '43'])('size');
    expect(t).toStrictEqual({ text: { path: 'size', query: ['42', '43'] } });
  });

  test('text multiple values and empty fuzzy', () => {
    const t = text(['42', '43'], {})('size');
    expect(t).toStrictEqual({ text: { path: 'size', query: ['42', '43'], fuzzy: {} } });
  });

  test('text multiple values and fuzzy', () => {
    const t = text(['42', '43'], { maxEdits: 2 })('size');
    expect(t).toStrictEqual({ text: { path: 'size', query: ['42', '43'], fuzzy: { maxEdits: 2 } } });
  });

  test('lt with undefined', () => {
    const v = lt(undefined)('size');
    expect(v).toBeUndefined();
  });

  test('lt', () => {
    const v = lt(42)('size');
    expect(v).toStrictEqual({ range: { path: 'size', lt: 42 } });
  });

  test('exists', () => {
    const v = exists()('size');
    expect(v).toStrictEqual({ exists: { path: 'size' } });
  });

  test('lte with undefined', () => {
    const v = lte(undefined)('size');
    expect(v).toBeUndefined();
  });

  test('lte', () => {
    const v = lte(42)('size');
    expect(v).toStrictEqual({ range: { path: 'size', lte: 42 } });
  });

  test('gt with undefined', () => {
    const v = gt(undefined)('size');
    expect(v).toBeUndefined();
  });

  test('gt', () => {
    const v = gt(42)('size');
    expect(v).toStrictEqual({ range: { path: 'size', gt: 42 } });
  });

  test('gte with undefined', () => {
    const v = gte(undefined)('size');
    expect(v).toBeUndefined();
  });

  test('gte', () => {
    const v = gte(42)('size');
    expect(v).toStrictEqual({ range: { path: 'size', gte: 42 } });
  });

  const date = '2023-06-23T08:38:38.938Z';
  const date2 = '2024-06-23T08:38:38.938Z';

  test('before', () => {
    const d = before(date)('start');
    expect(d).toStrictEqual({ range: { path: 'start', lt: new Date(date) } });
  });

  test('after', () => {
    const d = after(date)('start');
    expect(d).toStrictEqual({ range: { path: 'start', gte: new Date(date) } });
  });

  test('between with numbers', () => {
    const d = between(41, 52)('size');
    expect(d).toStrictEqual({ range: { path: 'size', gte: 41, lt: 52 } });
  });

  test('between with dates', () => {
    const d = between(date, date2)('start');
    expect(d).toStrictEqual({ range: { path: 'start', gte: new Date(date), lt: new Date(date2) } });
  });

  test('empty search', () => {
    const s = search({});
    expect(s).toStrictEqual({ $search: { compound: {} } });
  });

  test('text', () => {
    const h = lucene.clause({ brand: text('apple') });
    expect(h[0]).toStrictEqual({ text: { path: 'brand', query: 'apple' } });
  });

  test('text wildcard', () => {
    const h = lucene.clause({ wildcard: text('apple') });
    expect(h[0]).toStrictEqual({ text: { path: { wildcard: '*' }, query: 'apple' } });
  });

  test('text wildcard with fuzzy', () => {
    const h = lucene.clause({ wildcard: text('apple', {}) });
    expect(h[0]).toStrictEqual({ text: { path: { wildcard: '*' }, query: 'apple', fuzzy: {} } });
  });

  test('text wildcard with fuzzy options', () => {
    const h = lucene.clause({ wildcard: text('apple', { maxExpansions: 1, prefixLength: 2 }) });
    expect(h[0]).toStrictEqual({ text: { path: { wildcard: '*' }, query: 'apple', fuzzy: { maxExpansions: 1, prefixLength: 2 } } });
  });

  test('wildcard', () => {
    const h = lucene.clause({ wildcard: wildcard() });
    expect(h[0]).toStrictEqual({ wildcard: { path: { wildcard: '*' }, query: '*' } });
  });

  test('should search, single clause', () => {
    const s = search({ should: { brand: text('apple') } });
    expect(s).toStrictEqual({ $search: { compound: { should: [{ text: { path: 'brand', query: 'apple' } }] } } });
  });

  test('should search, single fuzzy clause', () => {
    const s = search({ should: { wildcard: text('appel', {}) } });
    expect(s).toStrictEqual({ $search: { compound: { should: [{ text: { path: { wildcard: '*' }, query: 'appel', fuzzy: {} } }] } } });
  });

  test('should search, single clause and index', () => {
    const s = search({ should: { brand: text('apple') } }, 'data.nl');
    expect(s).toStrictEqual({
      $search: {
        index: 'data.nl',
        compound: { should: [{ text: { path: 'brand', query: 'apple' } }] },
      },
    });
  });

  test('should search, multiple clauses', () => {
    const s = search({ should: [{ brand: text('apple') }, { size: lt(42) }] });
    expect(s).toStrictEqual({
      $search: {
        compound: {
          should: [
            {
              text: {
                path: 'brand',
                query: 'apple',
              },
            },
            { range: { path: 'size', lt: 42 } },
          ],
        },
      },
    });
  });

  test('should search, multiple clauses in one object', () => {
    const s = search({ should: { brand: text('apple'), size: lt(42) } });
    expect(s).toStrictEqual({
      $search: {
        compound: {
          should: [
            {
              text: {
                path: 'brand',
                query: 'apple',
              },
            },
            { range: { path: 'size', lt: 42 } },
          ],
        },
      },
    });
  });

  test('clauses', () => {
    const s = clauses({ brand: text('42') });
    expect(s[0]).toStrictEqual({ text: { path: 'brand', query: '42' } });

    const s2 = clauses({ brand: text('42'), slotId: text([42, 43]) });
    expect(s2[0]).toStrictEqual({ text: { path: 'brand', query: '42' } });
    expect(s2[1]).toStrictEqual({ text: { path: 'slotId', query: [42, 43] } });

    const s3 = clauses([{ brand: text('42') }, { slotId: text([42, 43]) }]);
    expect(s3[0]).toStrictEqual({ text: { path: 'brand', query: '42' } });
    expect(s3[1]).toStrictEqual({ text: { path: 'slotId', query: [42, 43] } });
  });

  const def: SearchDefinition = {
    // @ts-ignore
    brand: v => ({ should: { brand: text(v) } }),
    // @ts-ignore
    size: v => ({ should: { size: lt(v) } }),
    // @ts-ignore
    q: v => ({ should: { wildcard: text(v) } }),
    // @ts-ignore
    fuzzy: v => ({ should: { wildcard: text(v, { maxExpansions: 1, prefixLength: 2 }) } }),
    // @ts-ignore
    status: () => ({ facet: facet.string('status') }),
    // @ts-ignore
    price: () => ({ facet: facet.number('price.cents', toList(500, 2000, 3500, 6000)) }),
  };
  describe('search', () => {
    test('empty search', () => {
      const s = searchWithDef({}, def);
      expect(s).toStrictEqual({ $search: { compound: { should: [{ wildcard: { path: { wildcard: '*' }, query: '*' } }] } } });
    });

    test('should search, single clause', () => {
      const s = searchWithDef({ brand: 'apple' }, def);
      expect(s).toStrictEqual({ $search: { compound: { should: [{ text: { path: 'brand', query: 'apple' } }] } } });
    });

    test('should search, single fuzzy clause', () => {
      const s = searchWithDef({ fuzzy: 'appel' }, def);
      expect(s).toStrictEqual({
        $search: { compound: { should: [{ text: { path: { wildcard: '*' }, query: 'appel', fuzzy: { maxExpansions: 1, prefixLength: 2 } } }] } },
      });
    });

    test('should search, single clause and index', () => {
      const s = searchWithDef({ brand: 'apple' }, def, 'data.nl');
      expect(s).toStrictEqual({
        $search: {
          index: 'data.nl',
          compound: { should: [{ text: { path: 'brand', query: 'apple' } }] },
        },
      });
    });

    test('should search, multiple clauses', () => {
      const s = searchWithDef({ brand: 'apple', size: 42 }, def);
      expect(s).toStrictEqual({
        $search: {
          compound: {
            should: [
              {
                text: {
                  path: 'brand',
                  query: 'apple',
                },
              },
              { range: { path: 'size', lt: 42 } },
            ],
          },
        },
      });
    });
  });

  describe('searchMeta', () => {
    test('facets work', () => {
      const s = lucene.searchMeta({}, def);
      expect(s).toStrictEqual({
        $searchMeta: {
          facet: {
            operator: {
              compound: { should: [{ wildcard: { path: { wildcard: '*' }, query: '*' } }] },
            },
            facets: {
              status: { path: 'status', type: 'string', numBuckets: 1000 },
              price: { path: 'price.cents', type: 'number', boundaries: [500, 2000, 3500, 6000] },
            },
          },
        },
      });
    });
  });

  test('works without giving facets', () => {
    const def: SearchDefinition = {
      brand: v => ({ should: { brand: text(v) } }),
    };
    const s = lucene.searchMeta({}, def);
    expect(s).toStrictEqual({
      $searchMeta: {
        compound: { should: [{ wildcard: { path: { wildcard: '*' }, query: '*' } }] },
      },
    });
  });
});
