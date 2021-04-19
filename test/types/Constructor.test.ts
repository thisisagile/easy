import { Dev, DevUri } from '../ref';
import { isConstructor, ofConstruct, toName, text } from '../../src';

describe('toName', () => {
  test('check', () => {
    expect(toName(undefined)).toBe('');
    expect(toName(Dev.Naoufal)).toBe('dev');
    expect(toName(DevUri.Developers, 'Uri')).toBe('dev');
  });
});

class Tester {
  constructor(readonly name = 'Jeroen', readonly level = 3) {}
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
});
