import '@thisisagile/easy-test';
import { Email, isList, isPageList, Money, toList, toPageList, View, view, views } from '../../src';
import { Dev } from '../ref';

const { ignore, or, keep, keepOr, value, to } = views;

describe('View', () => {
  test('construct default view', () => {
    const v = new View();
    expect(v.viewers).toHaveLength(0);
    expect(v.startsFrom).toBe('scratch');
  });

  test('construct non-default view', () => {
    const v = new View({}, 'source');
    expect(v.viewers).toHaveLength(0);
    expect(v.startsFrom).toBe('source');
  });

  test('construct from view()', () => {
    const v = view({}).fromSource;
    expect(v.viewers).toHaveLength(0);
    expect(v.startsFrom).toBe('source');
  });

  test('construct with actual view', () => {
    const persons = view({ first: 'FirstName' });
    expect(persons.viewers).toHaveLength(1);
    expect(persons.startsFrom).toBe('scratch');
  });

  test('from scratch and from source', () => {
    const source = {
      FirstName: 'Sander',
      LastName: 'H',
    };
    const fromScratch = view({});
    const fromSource = view({}).fromSource;
    expect(fromScratch.from(source)).toStrictEqual({});
    expect(fromSource.from(source)).toStrictEqual(source);
    expect(fromSource.from(Dev.Wouter)).toStrictEqual(Dev.Wouter.toJSON());
  });

  test('toViewers empty', () => {
    expect(view({}).viewers).toHaveLength(0);
  });

  test('view string column', () => {
    const v = view({ first: 'FirstName' });
    expect(v.viewers).toHaveLength(1);
    expect(v.viewers[0]?.in?.key).toBe('first');
    expect(v.from({ FirstName: 'Sander' })).toStrictEqual({ first: 'Sander' });
  });

  test('view string column same name source and target', () => {
    const v = view({ first: 'first', last: undefined }).fromSource;
    expect(v.from({ first: 'Sander', last: 'H' })).toStrictEqual({ first: 'Sander' });
  });

  test('view with number constant', () => {
    const v = view({ first: 'first', age: 42 }).fromSource;
    expect(v.from({ first: 'Sander', last: 'H' })).toStrictEqual({ first: 'Sander', age: 42, last: 'H' });
  });

  test('view with boolean constant', () => {
    const v = view({ first: 'first', contract: false }).fromSource;
    expect(v.from({ first: 'Sander', last: 'H' })).toStrictEqual({ first: 'Sander', last: 'H', contract: false });
  });

  test('view string column with dot notation', () => {
    const v = view({ first: 'Name.FirstName' });
    expect(v.from({ Name: { FirstName: 'Sander' } })).toStrictEqual({ first: 'Sander' });
  });

  test('view string column with function', () => {
    const v = view({ first: a => a.Name.First.toUpperCase() });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'SANDER' });
  });

  test('view string column with array function', () => {
    const v = view({ scopes: a => a.Scopes.map((s: string) => s.toUpperCase()) });
    expect(v.from({ Scopes: ['tech', 'support', 'hr'] })).toStrictEqual({ scopes: ['TECH', 'SUPPORT', 'HR'] });
  });

  test('view with an InOut, but only col', () => {
    const v = view({ first: { col: 'Name.First' } });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'Sander' });
  });

  test('view with an InOut, but only in', () => {
    const v = view({ first: { in: a => a.Name.First } });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'Sander' });
  });

  test('view with an InOut, with col and function in', () => {
    const v = view({ first: { col: 'Company.Title', in: a => a.toUpperCase() } });
    expect(v.from({ Company: { Title: 'ditisagile' } })).toStrictEqual({ first: 'DITISAGILE' });
  });

  test('view with an InOut, with no col (so default) and function in', () => {
    const v = view({ title: { in: a => a.title.toUpperCase() } });
    expect(v.from({ title: 'ditisagile' })).toStrictEqual({ title: 'DITISAGILE' });
  });

  test('view with an InOut, with col and view in', () => {
    const v2 = view({ name: 'Name' });
    const v = view({ first: { col: 'Company', in: v2 } });
    expect(v.from({ Company: { Name: 'ditisagile' } })).toStrictEqual({ first: { name: 'ditisagile' } });
  });

  test('view with an InOut, with col and view in with col and function', () => {
    const v2 = view({ name: { col: 'Name', in: a => a.toUpperCase() } });
    const v = view({ first: { col: 'Company', in: v2 } });
    expect(v.from({ Company: { Name: 'ditisagile' } })).toStrictEqual({ first: { name: 'DITISAGILE' } });
  });


  test('view with an InOut, and different type', () => {
    const v2 = view<{name: string}>({ name: { col: 'Name', in: a => a.toUpperCase() } });
    const v = view({ first: { col: 'Company', in: v2 } });
    expect(v.from({ Company: { Name: 'ditisagile' } })).toStrictEqual({ first: { name: 'DITISAGILE' } });
  });

  test('view with an InOut, with col and function in on an array', () => {
    const v = view({ name: 'Company.Name', divisions: { col: 'Company.Divisions', in: a => a.toUpperCase() } });
    expect(
      v.from({
        Company: {
          Name: 'ditisagile',
          Divisions: ['Tech', 'Support', 'HR'],
        },
      })
    ).toStrictEqual({ name: 'ditisagile', divisions: ['TECH', 'SUPPORT', 'HR'] });
  });

  test('view with an InOut, with col and view in on an array', () => {
    const divisions = view({ name: { col: 'Name', in: a => a.toUpperCase() } });
    const company = view({ name: 'Company.Name', divisions: { col: 'Company.Divisions', in: divisions } });
    expect(
      company.from({
        Company: {
          Name: 'ditisagile',
          Divisions: [{ Name: 'Tech' }, { Name: 'Support' }, { Name: 'HR' }],
        },
      })
    ).toStrictEqual({ name: 'ditisagile', divisions: [{ name: 'TECH' }, { name: 'SUPPORT' }, { name: 'HR' }] });
  });

  test('with one entity', () => {
    const devs = view({ name: 'name', language: { col: 'language', in: l => l.toUpperCase() } });
    expect(devs.from(Dev.Rob)).toStrictEqual({ name: 'Rob', language: 'TYPESCRIPT' });
  });

  test('with multiple entity', () => {
    const devs = view({ name: 'name', language: { col: 'language', in: l => l.toUpperCase() } });
    expect(devs.from([Dev.Rob, Dev.Jeroen])).toStrictEqual([
      { name: 'Rob', language: 'TYPESCRIPT' },
      {
        name: 'Jeroen',
        language: 'TYPESCRIPT',
      },
    ]);
  });

  type DevName = {
    readonly name: string;
  };

  test('PageList, List, Array of T should return Pagelist, List, Array of V', () => {
    const onlyNameView = view<DevName>({ name: 'name' });

    const arr = onlyNameView.from([Dev.Rob, Dev.Jeroen]);
    expect(arr).toBeInstanceOf(Array);
    expect(arr).toHaveLength(2);
    expect(arr[0]).toEqual({ name: 'Rob' });
    expect(arr[1]).toEqual({ name: 'Jeroen' });
    expect(isList(arr)).toBeFalsy();

    const single = onlyNameView.from(Dev.Rob);
    expect(single).toBeInstanceOf(Object);
    expect(single).not.toBeInstanceOf(Array);
    expect(single).toEqual({ name: 'Rob' });

    const devsList = toList<Dev>([Dev.Rob, Dev.Jeroen]);
    const list = onlyNameView.from(devsList);
    expect(isList(list)).toBeTruthy();

    const devsPageList = toPageList<Dev>([Dev.Rob, Dev.Jeroen], { total: 42 });
    const pl = onlyNameView.from(devsPageList);
    expect(isPageList(pl)).toBeTruthy();
    expect(pl.total).toBe(42);
  });

  test('same', () => {
    const devs = view({ id: 'id', name: 'name', language: 'language' });
    expect(devs.same(Dev.Naoufal, { name: 'Naoufal' })).toBeFalsy();
    expect(devs.same(Dev.Naoufal, Dev.Jeroen)).toBeFalsy();
    expect(devs.same(Dev.Jeroen, Dev.Jeroen)).toBeTruthy();
  });

  // Using views

  test('views or', () => {
    const v = view({ first: or('Name.First'), last: keepOr('H') });
    expect(v.from({ Name: { First: 'Sander' }, last: 'Hoog' })).toStrictEqual({ first: 'Sander', last: 'Hoog' });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'Sander', last: 'H' });
  });

  test('views ignore', () => {
    const v = view({ Name: ignore });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({});
  });

  test('views value', () => {
    const v = view({ First: value(42) });
    expect(v.from({})).toStrictEqual({ First: 42 });
  });

  test('views keep', () => {
    const v = view({ First: keep });
    expect(v.from({ First: 'Sander' })).toStrictEqual({ First: 'Sander' });
  });

  const toThing = view({
    first: keep,
    last: keepOr('Pieterse'),
    age: keepOr(56),
  });

  test('views keepOr', () => {
    const j = toThing.from({ first: 'Jan', last: 'Jansen', age: 3 });
    expect(j).toMatchObject({ first: 'Jan', last: 'Jansen', age: 3 });
    const j2 = toThing.from({ first: 'Jan' });
    expect(j2).toMatchObject({ first: 'Jan', last: 'Pieterse', age: 56 });
  });

  test('views to simple', () => {
    const v = view({ email: to(Email) });
    expect(v.from({ email: 'sander@ibood.com' }).email).toBeInstanceOf(Email);
  });

  test('views to composite', () => {
    const v = view({ turnover: to(Money) });
    const c = v.from({ turnover: { currency: 'EUR', amount: 42 } });
    expect(c.turnover).toBeInstanceOf(Money);
  });

  test('views simple constructor', () => {
    const v = view({ email: to(Email) });
    const c = v.from({ email: 'wouter@gmail.com' });
    expect(c.email).toBeInstanceOf(Email);
    expect((c as any).email.value).toBe('wouter@gmail.com');
  });

  test('views constructor', () => {
    const v = view({ turnover: to(Money) });
    const c = v.from({ turnover: { currency: 'EUR', value: 42 } });
    expect(c.turnover).toBeInstanceOf(Money);
    expect((c.turnover as any).value).toBe(42);
  });

  const emails = ['sam@gmail.com', 'boet@gmail.com', 'spijk@gmail.com'];

  test('views simple constructor with array in other field', () => {
    const v = view({ email: { col: 'emails', in: e => new Email(e) } });
    const c = v.from({ emails });
    expect(c.email).toHaveLength(3);
    expect((c as any).email[0]).toBeInstanceOf(Email);
    expect((c as any).email[0].value).toBe(emails[0]);
  });

  type Student = { id: number; name: string; loan: number };

  test('typed views', () => {
    const toStudent = view<Student>({
      loan: 3000,
      name: s => `${s.name} Hoogendoorn`,
    }).fromSource;
    const s = toStudent.from({ id: 3, loan: 3, name: 'Sander' });
    expect(s).toMatchJson({ id: 3, loan: 3000, name: 'Sander Hoogendoorn' });
  });
});
