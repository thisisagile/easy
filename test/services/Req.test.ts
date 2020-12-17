import { toReq } from '../../src';

describe('Req', () => {
  const req = { params: { id: 42, name: 'Naoufal' }, query: { q: 43, language: 'TypeScript' }, body: {} };
  const params = { params: { id: 42, name: 'Naoufal' } };

  test('toReq from full object', () => {
    const r = toReq(req);
    expect(r).toMatchObject({
      path: { id: 42, name: 'Naoufal' },
      id: 42,
      query: { q: 43, language: 'TypeScript' },
      q: 43,
      body: {},
    });
  });

  test('toReq from params', () => {
    const r = toReq(params);
    expect(r).toMatchObject({
      path: { id: 42, name: 'Naoufal' },
      id: 42,
      q: undefined,
      body: undefined,
    });
  });
});
