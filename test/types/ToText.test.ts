import {text} from '../../src';
import {Dev} from '../ref';
import '@thisisagile/easy-test';

describe('ToText', () => {
  const empty = text();
  const wouter = text('Wouter');
  const kim = text('Kim van Wilgen');
  const sander = text('SanDEr hoogendOOrn');

  test('cap works', () => {
    expect(empty.cap).toMatchText('');
    expect(text({}).cap).toMatchText('');
    expect(wouter.cap).toMatchText('Wouter');
    expect(text(Dev.Sander).cap).toMatchText('Sander');
    expect(kim.cap).toMatchText('Kim van wilgen');
    expect(sander.cap).toMatchText('Sander hoogendoorn');
  });

  test('title works', () => {
    expect(empty.title).toMatchText('');
    expect(text({}).title).toMatchText('');
    expect(wouter.title).toMatchText('Wouter');
    expect(text(Dev.Sander).title).toMatchText('Sander');
    expect(kim.title).toMatchText('Kim Van Wilgen');
    expect(sander.title).toMatchText('Sander Hoogendoorn');
  });

  test('pascal works', () => {
    expect(empty.pascal).toMatchText('');
    expect(text({}).pascal).toMatchText('');
    expect(wouter.pascal).toMatchText('Wouter');
    expect(text(Dev.Sander).pascal).toMatchText('Sander');
    expect(kim.pascal).toMatchText('KimVanWilgen');
  });

  test('camel works', () => {
    expect(empty.camel).toMatchText('');
    expect(text({}).camel).toMatchText('');
    expect(wouter.camel).toMatchText('wouter');
    expect(text(Dev.Sander).camel).toMatchText('sander');
    expect(kim.camel).toMatchText('kimVanWilgen');
  });

  test('kebab works', () => {
    expect(empty.kebab).toMatchText('');
    expect(text({}).kebab).toMatchText('');
    expect(wouter.kebab).toMatchText('wouter');
    expect(text(Dev.Sander).kebab).toMatchText('sander');
    expect(kim.kebab).toMatchText('kim-van-wilgen');
  });

  test('snake works', () => {
    expect(empty.snake).toMatchText('');
    expect(text({}).snake).toMatchText('');
    expect(wouter.snake).toMatchText('WOUTER');
    expect(text(Dev.Sander).snake).toMatchText('SANDER');
    expect(kim.snake).toMatchText('KIM_VAN_WILGEN');
  });

  test('initials works', () => {
    expect(empty.initials).toMatchText('');
    expect(text({}).initials).toMatchText('');
    expect(wouter.initials).toMatchText('W');
    expect(text(Dev.Sander).initials).toMatchText('S');
    expect(kim.initials).toMatchText('KvW');
  });

  test('trim works', () => {
    expect(empty.trim).toMatchText('');
    expect(text({}).trim).toMatchText('');
    expect(wouter.trim).toMatchText('Wouter');
    expect(text(Dev.Sander).trim).toMatchText('Sander');
    expect(kim.trim).toMatchText('KimvanWilgen');
  });

  test('startsWith works', () => {
    expect(empty.startsWith()).toBeTruthy();
    expect(empty.startsWith('')).toBeTruthy();
    expect(kim.startsWith()).toBeTruthy();
    expect(kim.startsWith('')).toBeTruthy();
    expect(kim.startsWith('Kim')).toBeTruthy();
    expect(kim.lower.startsWith('kim')).toBeTruthy();
    expect(kim.startsWith('Sander')).toBeFalsy();
  });

  test('endsWith works', () => {
    expect(empty.endsWith()).toBeTruthy();
    expect(empty.endsWith('')).toBeTruthy();
    expect(kim.endsWith()).toBeTruthy();
    expect(kim.endsWith('')).toBeTruthy();
    expect(kim.endsWith('gen')).toBeTruthy();
    expect(kim.endsWith('doorn')).toBeFalsy();
  });

  test("Check equals", () => {
    expect(kim.isLike("Kim van Wilgen")).toBeTruthy();
    expect(kim.isLike("kimvanwilgen")).toBeTruthy();
    expect(kim.isLike("kim van wilgen")).toBeTruthy();
    expect(kim.isLike("kim-van-wilgen")).toBeTruthy();
    expect(kim.isLike("kim")).toBeFalsy();
    expect(empty.isLike("")).toBeTruthy();
    expect(empty.isLike("kim")).toBeFalsy();
    expect(wouter.isLike(Dev.Wouter)).toBeTruthy();
  });
});
