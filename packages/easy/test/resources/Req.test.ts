import { Req, toReq } from '../../src/resources';
import { DevUri } from '../ref';

describe('Req', () => {
  const req = { params: { id: 42, name: 'Naoufal' }, query: { q: 43, language: 'TypeScript' }, body: {} };
  const reqPaged = { params: { id: 42, name: 'Jeroen' }, query: { q: 43, language: 'TypeScript', skip: 15, take: 5 }, body: {} };
  const params = { params: { id: 42, name: 'Naoufal' } };

  test('matches', () => {
    const r = toReq(req);
    expect(r.id).toBe(req.params.id);
    expect(r.q).toBe(req.query.q);
    expect(r.path.name).toBe(req.params.name);
    expect(r.query.language).toBe(req.query.language);
  });

  test('get', () => {
    const r = toReq(req);
    expect(r.get('name')).toBe(req.params.name);
    expect(r.get('language')).toBe(req.query.language);
    expect(r.get('shoesize')).toBeUndefined();
    expect(r.get(DevUri.language)).toBe(req.query.language);
  });

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

  test('toReqPaged from full object', () => {
    const r = toReq(reqPaged);
    expect(r).toMatchObject({
      path: { id: 42, name: 'Jeroen' },
      id: 42,
      query: { q: 43, language: 'TypeScript' },
      q: 43,
      skip: 15,
      take: 5,
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
      skip: undefined,
      take: undefined,
    });
  });

  test('get skip and take', () => {
    const r = new Req({}, { skip: 15, take: 5 }, {}, {});
    expect(r.skip).toBe(15);
    expect(r.take).toBe(5);
  });

  test('skip and take if not number', () => {
    const r = new Req({}, { skip: '15', take: '5' }, {}, {});
    expect(r.skip).toBe(15);
    expect(r.take).toBe(5);
  });

  test('toReq from with headers', () => {
    const headers = { authorization: 'Bearer 1234' };
    const r = toReq({ headers });
    expect(r.headers).toMatchObject(headers);
  });
});
