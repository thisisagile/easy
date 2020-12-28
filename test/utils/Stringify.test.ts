import { Stringify, stringify } from '../../src';
import { Dev } from '../ref';

describe('Stringify', () => {
  const empty = stringify();
  const wouter = stringify('Wouter');
  const kim = stringify('Kim van Wilgen');

  test('cap works', () => {
    expect(empty.cap).toBe('');
    expect(stringify({}).cap).toBe('');
    expect(wouter.cap).toBe('Wouter');
    expect(stringify(Dev.Sander).cap).toBe('Sander');
    expect(kim.cap).toBe('Kim van Wilgen');
  });

  test('title works', () => {
    expect(empty.title).toBe('');
    expect(stringify({}).title).toBe('');
    expect(wouter.title).toBe('Wouter');
    expect(stringify(Dev.Sander).title).toBe('Sander');
    expect(kim.title).toBe('Kim Van Wilgen');
  });

  test('pascal works', () => {
    expect(empty.pascal).toBe('');
    expect(stringify({}).pascal).toBe('');
    expect(wouter.pascal).toBe('Wouter');
    expect(stringify(Dev.Sander).pascal).toBe('Sander');
    expect(kim.pascal).toBe('KimVanWilgen');
  });

  test('camel works', () => {
    expect(empty.camel).toBe('');
    expect(stringify({}).camel).toBe('');
    expect(wouter.camel).toBe('wouter');
    expect(stringify(Dev.Sander).camel).toBe('sander');
    expect(kim.camel).toBe('kimVanWilgen');
  });

  test('kebab works', () => {
    expect(empty.kebab).toBe('');
    expect(stringify({}).kebab).toBe('');
    expect(wouter.kebab).toBe('wouter');
    expect(stringify(Dev.Sander).kebab).toBe('sander');
    expect(kim.kebab).toBe('kim-van-wilgen');
  });

  test('snake works', () => {
    expect(empty.snake).toBe('');
    expect(stringify({}).snake).toBe('');
    expect(wouter.snake).toBe('WOUTER');
    expect(stringify(Dev.Sander).snake).toBe('SANDER');
    expect(kim.snake).toBe('KIM_VAN_WILGEN');
  });

  test('initials works', () => {
    expect(empty.initials).toBe('');
    expect(stringify({}).initials).toBe('');
    expect(wouter.initials).toBe('W');
    expect(stringify(Dev.Sander).initials).toBe('S');
    expect(kim.initials).toBe('KvW');
  });

  test('trim works', () => {
    expect(empty.trim).toBe('');
    expect(stringify({}).trim).toBe('');
    expect(wouter.trim).toBe('Wouter');
    expect(stringify(Dev.Sander).trim).toBe('Sander');
    expect(kim.trim).toBe('KimvanWilgen');
  });
});

