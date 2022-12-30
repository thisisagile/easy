import { Dev, DevUri } from '../ref';
import { ifA, isConstructor, ofConstruct, on, text, toName } from '../../src';

describe('toName', () => {
  test('check', () => {
    expect(toName(undefined)).toBe('');
    expect(toName(Dev.Naoufal)).toBe('dev');
    expect(toName(DevUri.Developers, 'Uri')).toBe('dev');
  });
});

class Tester {
  constructor(public name = 'Jeroen', readonly level = 3) {}

  rename = (n: string) => (this.name = n);
}

describe('isConstructor', () => {
  test('false', () => {
    expect(isConstructor()).toBeFalsy();
    expect(isConstructor(3)).toBeFalsy();
    expect(isConstructor('3')).toBeFalsy();
    expect(isConstructor({})).toBeFalsy();
    expect(
      isConstructor(() => {
        'Naoufal';
      })
    ).toBeFalsy();
    expect(isConstructor(() => text('Yes'))).toBeFalsy();
    expect(isConstructor(text)).toBeFalsy();
    expect(isConstructor(new Tester())).toBeFalsy();
    expect(isConstructor(new Tester())).toBeFalsy();
  });

  test('true', () => {
    expect(isConstructor(String)).toBeTruthy();
    expect(isConstructor(Symbol)).toBeTruthy();
    expect(isConstructor(Tester)).toBeTruthy();
  });
});

describe('ofConstruct', () => {
  test('ofConstruct with instance', () => {
    const t = ofConstruct(new Tester('Sander', 4));
    expect(t.name).toBe('Sander');
    expect(t.level).toBe(4);
  });

  test('ofConstruct with function', () => {
    const t = ofConstruct(() => new Tester('Sander', 4));
    expect(t.name).toBe('Sander');
    expect(t.level).toBe(4);
  });

  test('ofConstruct with constructor', () => {
    const t = ofConstruct(Tester);
    expect(t.name).toBe('Jeroen');
    expect(t.level).toBe(3);
  });

  test('ofConstruct with constructor and one parameter', () => {
    const t = ofConstruct(Tester, 'Wouter');
    expect(t.name).toBe('Wouter');
    expect(t.level).toBe(3);
  });

  test('ofConstruct with constructor and multiple different parameters', () => {
    const t = ofConstruct(Tester, 'Wouter', 4);
    expect(t.name).toBe('Wouter');
    expect(t.level).toBe(4);
  });

  test('ofConstruct with instance ignores args', () => {
    const t = ofConstruct(new Tester('Sander', 4), 'Wouter', 6);
    expect(t.name).toBe('Sander');
    expect(t.level).toBe(4);
  });
});

describe('on', () => {
  test('check on', () => {
    const tester = new Tester();
    const t2 = on(tester, t => t.rename('Rob'));
    expect(tester).toStrictEqual(t2);
    expect(t2.name).toBe('Rob');
  });
});

describe('ifA', () => {
  test('as', () => {
    expect(ifA(Dev)).toBeFalsy();
    expect(ifA(Dev, undefined)).toBeFalsy();
    expect(ifA(Dev, undefined)).toBeFalsy();
    expect(ifA(Dev, true)).toBeFalsy();
    expect(ifA(Dev, false)).toBeFalsy();
    expect(ifA(Dev, {})).toBeFalsy();
    expect(ifA(Dev, Dev.Naoufal as unknown as Dev)).toBeInstanceOf(Dev);
    expect(ifA(Dev, Dev.Rob)).toBeInstanceOf(Dev);
    expect(ifA(Dev, undefined, undefined)).toBeFalsy();
    expect(ifA(Dev, undefined, true)).toBeUndefined();
    expect(ifA(Dev, undefined, false)).toBeUndefined();
    expect(ifA(Dev, undefined, {})).toBeUndefined();
    expect(ifA(Dev, undefined, Dev.Eugen)).toBeInstanceOf(Dev);
  });
});
