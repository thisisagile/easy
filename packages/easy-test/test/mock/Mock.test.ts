import { mock } from '../../src';
import { HttpStatus } from '../../src/utils/Response';

describe('mock', () => {
  const version = 'Version 42';

  class Project {
    get name() {
      return 'DevOps';
    }
    version = (n: number): string => `Version ${n}`;
    fails = (no = true): Promise<string> => (no ? Promise.resolve('Project succeeds') : Promise.reject('Project fails'));
  }

  let project: Project;

  beforeEach(() => {
    project = new Project();
  });

  test('return works', () => {
    project.version = mock.return(version);
    expect(project.version(3)).toBe(version);
  });

  test('resolve works', () => {
    project.fails = mock.resolve(version);
    return expect(project.fails(false)).resolves.toBe(version);
  });

  test('reject works', () => {
    project.fails = mock.reject(version);
    return expect(project.fails(false)).rejects.toBe(version);
  });

  test('get works', () => {
    mock.property(project, 'name', version);
    expect(project.name).toBe(version);
  });

  test('impl works', () => {
    project.version = mock.impl((n: number) => `Beta ${n}`);
    expect(project.version(42)).toBe('Beta 42');
  });

  test('req id works', () => {
    const req = mock.req.id(42);
    expect(req.id).toBe(42);
  });

  test('req q works', () => {
    const req = mock.req.q('sander');
    expect(req.q).toBe('sander');
  });

  test('req from works', () => {
    const req = mock.req.with({ path: { id: 42, domain: 'dev' }, query: { q: 'jeroen' } });
    expect(req.id).toBe(42);
    expect(req.q).toBe('jeroen');
    expect(req.get('domain')).toBe('dev');
  });

  test('req body works', () => {
    const req = mock.req.body({ name: 'sander' });
    expect(req.body).toStrictEqual({ name: 'sander' });
  });

  test('response with items works', () => {
    const resp = mock.resp.items({id: 200} as HttpStatus, [{ name: 'sander' }]);
    expect(resp.body).toStrictEqual({ data: { code: 200, itemCount: 1, items: [{ name: 'sander' }] } });
  });

  test('response with errors works', () => {
    const resp = mock.resp.errors({id: 400} as HttpStatus, 'error', [{ timeout: 'timeout occurred' }]);
    expect(resp.body).toStrictEqual({ error: { code: 400, message: 'error', errorCount: 1, errors: [{ timeout: 'timeout occurred' }] } });
  });

  test('get props from state', () => {
    const req = mock.req.with({ name: 'sander' });
    expect(req.get('name')).toBe('sander');
    expect(req.get('last')).toBeUndefined();
  });

  test('get props from path', () => {
    const req = mock.req.path({ name: 'sander' });
    expect(req.get('name')).toBe('sander');
    expect(req.get('last')).toBeUndefined();
  });

  test('get props from query', () => {
    const req = mock.req.query({ name: 'sander' });
    expect(req.get('name')).toBe('sander');
    expect(req.get('last')).toBeUndefined();
  });

  test('get provider with data', () => {
    const data = mock.provider.data({ name: 'sander' });
    return expect(data.execute()).resolves.toMatchObject({ body: { data: { itemCount: 1, items: [{ name: 'sander' }] } } });
  });

  test('mock empty', () => {
    const p = mock.empty<Project>({ version: mock.return() });
    p.version(42);
    return expect(p.version).toHaveBeenCalledWith(42);
  });

  test('date', () => {
    const d = mock.date();
    const d2 = mock.date();
    expect(d.toString()).toBe(d2.toString());
    expect(d.toLocaleDateString()).toBe(d2.toLocaleDateString());
  });

  test('return once default no values works', () => {
    const m = mock.return(version);
    m.mockImplementationOnce(() => 'version 3');

    project.version = mock.once();
    expect(project.version(1)).toBeUndefined();
  });

  test('return once works', () => {
    const version2 = 'Version 43';
    project.version = mock.once(version, version2);
    expect(project.version(10)).toBe(version);
    expect(project.version(2)).toBe(version2);
    expect(project.version(3)).toBeUndefined();
  });
});
