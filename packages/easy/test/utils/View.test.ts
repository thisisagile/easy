import '@thisisagile/easy-test';
import {
    asNumber,
    Constructor,
    Email,
    isList,
    isPageList,
    Money,
    view,
    views,
    toList,
    toPageList,
    traverse,
    View,
} from "../../src";
import {Dev} from "../ref";

describe('ViewSimpleSimple', () => {

    let source: any;
    let source2: any;

    const {skip, or, keep, ignore, value} = views;

    beforeEach(() => {
        source = {
            id: 43,
            first: 'Sander',
            last: "H",
            age: 55,
            company: {id: 143, name: "iBOOD", city: "Amsterdam"},
            email: 'sander@ibood.io',
            tags: ['dev', 'arch', 'test']
        };
        source2 = {
            tags: ['dev', 'arch', 'test'],
            devs: [{id: 3, name: 'Wouter'}, {id: 4, name: 'Naoufal'}, {id: 5, name: 'Rob'}]
        };
    })

    test('undefined', () => {
        const s = view({id: undefined});
        expect(s.from(source)).toStrictEqual({});
        const s2 = view({id: undefined}).fromSource;
        expect(s2.from(source)?.id).toBeUndefined();
    });

    test('gone', () => {
        const s = view({id: ignore});
        expect(s.from(source)).toStrictEqual({});
        const s2 = view({id: ignore}).fromSource;
        expect(s2.from(source)?.id).toBeUndefined();
    });

    test('boolean', () => {
        const s = view({is18: true});
        expect(s.from(source)).toStrictEqual({is18: true});
        const s2 = view({id: true}).fromSource;
        expect(s2.from(source).id).toBeTruthy();
    });

    test('o', () => {
        const s = view({id: 0});
        expect(s.from(source)).toStrictEqual({});
        const s2 = view({id: 0}).fromSource;
        expect(s2.from(source)?.id).toBeUndefined();
    });

    test('1', () => {
        const s = view({age: 1});
        expect(s.from(source)).toStrictEqual({age: 55});
        const s2 = view({age: 1}).fromSource;
        expect(s2.from(source)).toStrictEqual({...source, age: 55});
    });

    test('number', () => {
        const s = view({age: 56});
        expect(s.from(source)).toStrictEqual({age: 56});
        const s2 = view({age: 56}).fromSource;
        expect(s2.from(source)).toStrictEqual({...source, age: 56});
    });

    test('string', () => {
        const s = view({id: 'id', city: 'company.city'});
        expect(s.from(source)).toStrictEqual({id: 43, city: 'Amsterdam'});
        const s2 = view({id: 'id', city: 'company.city'}).fromSource;
        expect(s2.from(source)).toStrictEqual({...source, id: 43, city: 'Amsterdam'});
    });

    test('multiple string', () => {
        const s = view({values: 'tags'});
        expect(s.from(source)).toStrictEqual({values: ['dev', 'arch', 'test']});
        const s2 = view({values: 'tags'}).fromSource;
        expect(s2.from(source)).toStrictEqual({...source, values: ['dev', 'arch', 'test']});
    });

    test('constructor', () => {
        const s = view({email: Email});
        expect(s.from(source).email).toBeInstanceOf(Email);
        const s2 = view({email: Email}).fromSource;
        expect(s2.from(source).email).toBeInstanceOf(Email);
    });

    test('function', () => {
        const s = view({id: a => asNumber(a.id) + 42});
        expect(s.from(source)).toStrictEqual({id: 85});
        const s2 = view({id: a => asNumber(a.id) + 42}).fromSource;
        expect(s2.from(source)).toStrictEqual({...source, id: 85});
    });

    test('simple', () => {
        const s2 = view({id: 'id', city: () => 'Utrecht'});
        const s = view({company: s2});
        expect(s.from(source).company).toStrictEqual({id: 143, city: 'Utrecht'});
        const s3 = view({company: s2}).fromSource;
        expect(s3.from(source).company).toStrictEqual({id: 143, city: 'Utrecht'});
    });

    test('simples', () => {
        const s = view({
            first: ignore,
            last: skip,
            id: keep,
            ceo: or.key('id'),
            coo: or.value('Rogier'),
            email: or.key('id'),
            email2: or.value('info@ibood.com'),
            level: value('CSM'),
            age: or.func(a => a.id),
            age2: or.func(a => a.id)
        });
        expect(source.age).toBe(55);
        expect(s.from(source)).toStrictEqual({
            id: 43,
            ceo: 43,
            coo: 'Rogier',
            email: 'sander@ibood.io',
            email2: 'info@ibood.com',
            level: 'CSM',
            age: 55,
            age2: 43
        });
    });

    test('array', () => {
        const s = view({tags: 'tags'});
        expect(s.from(source2)).toStrictEqual({tags: ['dev', 'arch', 'test']});
        const s2 = view({tags: 'tags'}).fromSource;
        expect(s2.from(source2).tags).toStrictEqual(['dev', 'arch', 'test']);
    });

    test('array with function', () => {
        const s = view({tags: s => s.tags.map((t: string) => t.concat('s'))});
        expect(s.from(source2)).toStrictEqual({tags: ['devs', 'archs', 'tests']});
        const s2 = view({tags: s => s.tags.map((t: string) => t.concat('s'))}).fromSource;
        expect(s2.from(source2).tags).toStrictEqual(['devs', 'archs', 'tests']);
    });

    const toDevs = view({id: ignore, name: a => a.name.toUpperCase()});

    test('array with simple', () => {
        const s = view({devs: toDevs});
        expect(s.from(source2)).toStrictEqual({devs: [{name: 'WOUTER'}, {name: 'NAOUFAL'}, {name: 'ROB'}]});
        const s2 = view({devs: toDevs}).fromSource;
        expect(s2.from(source2).devs).toStrictEqual([{name: 'WOUTER'}, {name: 'NAOUFAL'}, {name: 'ROB'}]);
    });

    test('array with constructor', () => {
        const s = view({devs: Dev});
        expect(s.from(source2).devs).toBeArrayOfWithLength(Dev, 3);
        const s2 = view({devs: Dev}).fromSource;
        expect(s2.from(source2).devs).toBeArrayOfWithLength(Dev, 3);
    });

    // Tests from the original view

    test('construct default simple', () => {
        const v = new View();
        expect(v.viewers).toHaveLength(0);
        expect(v.startsFrom).toBe('scratch');
    });

    test('construct non-default simple', () => {
        const v = new View({}, 'source');
        expect(v.viewers).toHaveLength(0);
        expect(v.startsFrom).toBe('source');
    });

    test('construct from simple()', () => {
        const v = view({}).fromSource;
        expect(v.viewers).toHaveLength(0);
        expect(v.startsFrom).toBe('source');
    });

    test('construct with actual simple', () => {
        const persons = view({first: 'FirstName'});
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

    test('toViewSimpleers empty', () => {
        expect(view({}).viewers).toHaveLength(0);
    });

    test('simple string column', () => {
        const v = view({first: 'FirstName'});
        expect(v.viewers).toHaveLength(1);
        // expect(v.viewers[0]?.in?.key).toBe('first');
        expect(v.from({FirstName: 'Sander'})).toStrictEqual({first: 'Sander'});
    });

    test('simple string column same name source and target', () => {
        const v = view({first: 'first', last: undefined}).fromSource;
        expect(v.from({first: 'Sander', last: 'H'})).toStrictEqual({first: 'Sander'});
    });

    test('simple with number constant', () => {
        const v = view({first: 'first', age: 42}).fromSource;
        expect(v.from({first: 'Sander', last: 'H'})).toStrictEqual({first: 'Sander', age: 42, last: 'H'});
    });

    test('simple with boolean constant', () => {
        const v = view({first: 'first', contract: false}).fromSource;
        expect(v.from({first: 'Sander', last: 'H'})).toStrictEqual({first: 'Sander', last: 'H', contract: false});
    });

    test('simple string column with dot notation', () => {
        const v = view({first: 'Name.FirstName'});
        expect(v.from({Name: {FirstName: 'Sander'}})).toStrictEqual({first: 'Sander'});
    });

    test('simple string column with function', () => {
        const v = view({first: a => a.Name.First.toUpperCase()});
        expect(v.from({Name: {First: 'Sander'}})).toStrictEqual({first: 'SANDER'});
    });

    test('simple string column with array function', () => {
        const v = view({scopes: a => a.Scopes.map((s: string) => s.toUpperCase())});
        expect(v.from({Scopes: ['tech', 'support', 'hr']})).toStrictEqual({scopes: ['TECH', 'SUPPORT', 'HR']});
    });

    type DevName = {
        readonly name: string;
    };

    test('PageList, List, Array of T should return Pagelist, List, Array of V', () => {
        const onlyNameViewSimple = view<DevName>({name: 'name'});

        const arr = onlyNameViewSimple.from([Dev.Rob, Dev.Jeroen]);
        expect(arr).toBeInstanceOf(Array);
        expect(arr).toHaveLength(2);
        expect(arr[0]).toEqual({name: 'Rob'});
        expect(arr[1]).toEqual({name: 'Jeroen'});
        expect(isList(arr)).toBeFalsy();

        const single = onlyNameViewSimple.from(Dev.Rob);
        expect(single).toBeInstanceOf(Object);
        expect(single).not.toBeInstanceOf(Array);
        expect(single).toEqual({name: 'Rob'});

        const devsList = toList<Dev>([Dev.Rob, Dev.Jeroen]);
        const list = onlyNameViewSimple.from(devsList);
        expect(isList(list)).toBeTruthy();

        const devsPageList = toPageList<Dev>([Dev.Rob, Dev.Jeroen], {total: 42});
        const pl = onlyNameViewSimple.from(devsPageList);
        expect(isPageList(pl)).toBeTruthy();
        expect(pl.total).toBe(42);
    });

    test('same', () => {
        const devs = view({id: 'id', name: 'name', language: 'language'});
        expect(devs.same(Dev.Naoufal, {name: 'Naoufal'})).toBeFalsy();
        expect(devs.same(Dev.Naoufal, Dev.Jeroen)).toBeFalsy();
        expect(devs.same(Dev.Jeroen, Dev.Jeroen)).toBeTruthy();
    });

    // Using simples

    const to = <T>(ctor: Constructor<T>) => (a: unknown, key?: string) => new ctor(traverse(a, key));

    test('simples or', () => {
        const v = view({first: or.key('Name.First'), last: or.value('H')});
        expect(v.from({Name: {First: 'Sander'}, last: 'Hoog'})).toStrictEqual({first: 'Sander', last: 'Hoog'});
        expect(v.from({Name: {First: 'Sander'}})).toStrictEqual({first: 'Sander', last: 'H'});
    });

    test('simples ignore', () => {
        const v = view({Name: ignore});
        expect(v.from({Name: {First: 'Sander'}})).toStrictEqual({});
    });

    test('simples value', () => {
        const v = view({First: value(42)});
        expect(v.from({})).toStrictEqual({First: 42});
    });

    test('simples keep', () => {
        const v = view({First: keep});
        expect(v.from({First: 'Sander'})).toStrictEqual({First: 'Sander'});
    });

    const toThing = view({
        first: keep,
        last: or.value('Pieterse'),
        age: or.value(56),
    });

    test('simples keepOr', () => {
        const j = toThing.from({first: 'Jan', last: 'Jansen', age: 3});
        expect(j).toMatchObject({first: 'Jan', last: 'Jansen', age: 3});
        const j2 = toThing.from({first: 'Jan'});
        expect(j2).toMatchObject({first: 'Jan', last: 'Pieterse', age: 56});
    });

    test('simples to simple', () => {
        const v = view({email: to(Email)});
        expect(v.from({email: 'sander@ibood.com'}).email).toBeInstanceOf(Email);
    });

    test('simples to composite', () => {
        const v = view({turnover: to(Money)});
        const c = v.from({turnover: {currency: 'EUR', amount: 42}});
        expect(c.turnover).toBeInstanceOf(Money);
    });

    test('simples simple constructor', () => {
        const v = view({email: to(Email)});
        const c = v.from({email: 'wouter@gmail.com'});
        expect(c.email).toBeInstanceOf(Email);
        expect((c as any).email.value).toBe('wouter@gmail.com');
    });

    test('simples constructor', () => {
        const v = view({turnover: to(Money)});
        const c = v.from({turnover: {currency: 'EUR', value: 42}});
        expect(c.turnover).toBeInstanceOf(Money);
        expect((c.turnover as any).value).toBe(42);
    });

    test('typed simples', () => {
        type Student = { id: number; name: string; loan: number };
        const toStudent = view<Student>({
            loan: 3000,
            name: s => `${s.name} Hoogendoorn`,
        }).fromSource;
        const s = toStudent.from({id: 3, loan: 3, name: 'Sander'});
        expect(s).toMatchJson({id: 3, loan: 3000, name: 'Sander Hoogendoorn'});
    });

});
