import { Req } from '../../src/utils/Req';

describe('Req', () => {
  const req = { path: { id: 42, name: 'Naoufal' }, query: { q: 43, language: 'TypeScript' }, body: {} };

  test('matches', () => {
    const r = new Req(req);
    expect(r.path.name).toBe(req.path.name);
    expect(r.query.language).toBe(req.query.language);
    expect(r.id).toBe(req.path.id);
    expect(r.q).toBe(req.query.q);
  });

  test('get skip and take', () => {
    const r = new Req({ query: { skip: 15, take: 5 } });
    expect(r.skip).toBe(15);
    expect(r.take).toBe(5);
  });

  test('skip and take if not number', () => {
    const r = new Req({ query: { skip: '15', take: '5' } });
    expect(r.skip).toBe(15);
    expect(r.take).toBe(5);
  });
});
