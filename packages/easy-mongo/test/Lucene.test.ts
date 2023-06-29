import '@thisisagile/easy-test';
import { lucene } from '../src';

describe('Lucene', () => {
  // Operations

  const { text, lt, lte, gt, gte, before, after, between, search, clauses } = lucene;

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

  test('field', () => {
    const h = lucene.clause({ brand: text('apple') });
    expect(h[0]).toStrictEqual({ text: { path: 'brand', query: 'apple' } });
  });

  test('should search, single clause', () => {
    const s = search({ should: { brand: text('apple') } });
    expect(s).toStrictEqual({ $search: { compound: { should: [{ text: { path: 'brand', query: 'apple' } }] } } });
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
});
