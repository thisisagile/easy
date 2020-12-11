import { toReq } from '../../src';

describe('Req', () => {

  const req = { params: { id: 42, name: 'Naoufal' }, query: { q: 43, language: 'TypeScript' }, body: {} };

  test('toReq', () => {
    const r = toReq(req);
    expect(r).toMatchObject({
      path: { id: 42, name: 'Naoufal' },
      id: 42,
      query: { q: 43, language: 'TypeScript' },
      q: 43,
      body: {},
    });
  });
});
