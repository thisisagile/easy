import { text } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';

describe('text()', () => {
  const KimvanWilgen = 'Kim van Wilgen';
  const KimKebab = 'kim-van-wilgen';
  const KimLower = 'kim van wilgen';

  const empty = text();
  const wouter = text('Wouter');
  const kim = text(KimvanWilgen);
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
    expect(kim.kebab).toMatchText(KimKebab);
  });

  test('plural works', () => {
    expect(empty.plural).toMatchText('');
    expect(text({}).plural).toMatchText('');
    expect(wouter.plural).toMatchText('Wouters');
    expect(text(Dev.Sander).plural).toMatchText('Sanders');
    expect(kim.plural).toMatchText('Kim van Wilgens');
  });

  test('isEmpty works', () => {
    expect(empty.isEmpty).toBeTruthy();
    expect(text({}).isEmpty).toBeTruthy();
    expect(wouter.isEmpty).toBeFalsy();
    expect(text(Dev.Sander).isEmpty).toBeFalsy();
    expect(kim.isEmpty).toBeFalsy();
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

  test('add works', () => {
    expect(text().add()).toMatchText('');
    expect(text().add(undefined, 'x')).toMatchText('');
    expect(text('kim').add()).toMatchText('kim');
    expect(text('kim').add(undefined, 'x')).toMatchText('kim');
    expect(text('kim').add('sander')).toMatchText('kimsander');
    expect(text('kim').add('sander', ' ')).toMatchText('kim sander');
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

  test('first works', () => {
    expect(empty.first(1)).toMatchText('');
    expect(empty.first(-1)).toMatchText('');
    expect(kim.first(3)).toMatchText('Kim');
    expect(text('12').first(3)).toMatchText('12');
    expect(kim.first(2)).toMatchText('Ki');
    expect(kim.first(-1)).toMatchText('');
    expect(kim.first(0)).toMatchText('');
  });

  test('last works', () => {
    expect(empty.last(1)).toMatchText('');
    expect(empty.last(-1)).toMatchText('');
    expect(kim.last(3)).toMatchText('gen');
    expect(kim.last(2)).toMatchText('en');
    expect(kim.last(-1)).toMatchText('');
    expect(kim.last(0)).toMatchText('');
  });

  test('is', () => {
    expect(kim.is(KimvanWilgen)).toBeTruthy();
    expect(kim.is('kimvanwilgen')).toBeFalsy();
    expect(kim.is(KimLower)).toBeFalsy();
    expect(kim.is(KimKebab)).toBeFalsy();
    expect(kim.is('kim')).toBeFalsy();
    expect(empty.is('')).toBeTruthy();
    expect(empty.is('kim')).toBeFalsy();
    expect(wouter.is(Dev.Wouter)).toBeTruthy();
    expect(kim.is(Dev.Jeroen, KimvanWilgen)).toBeTruthy();
    expect(kim.is(Dev.Jeroen, 'kimvanwilgen')).toBeFalsy();
  });

  test('isLike', () => {
    expect(kim.isLike(KimvanWilgen)).toBeTruthy();
    expect(kim.isLike('kimvanwilgen')).toBeTruthy();
    expect(kim.isLike(KimLower)).toBeTruthy();
    expect(kim.isLike(KimKebab)).toBeTruthy();
    expect(kim.isLike('kim')).toBeFalsy();
    expect(empty.isLike('')).toBeTruthy();
    expect(empty.isLike('kim')).toBeFalsy();
    expect(wouter.isLike(Dev.Wouter)).toBeTruthy();
    expect(kim.isLike(Dev.Jeroen, KimvanWilgen)).toBeTruthy();
    expect(kim.isLike(Dev.Jeroen, 'kimvanwilgen')).toBeTruthy();
  });

  test('ifLike', () => {
    expect(kim.ifLike(KimvanWilgen)).toBe(kim);
    expect(kim.ifLike('kimvanwilgen')).toBe(kim);
    expect(kim.ifLike(KimLower)).toBe(kim);
    expect(kim.ifLike(KimKebab)).toBe(kim);
    expect(kim.ifLike('kim')).toBeUndefined();
    expect(empty.ifLike('')).toBe(empty);
    expect(empty.ifLike('kim')).toBeUndefined();
    expect(wouter.ifLike(Dev.Wouter)).toBe(wouter);
    expect(kim.ifLike(Dev.Jeroen, KimvanWilgen)).toBe(kim);
    expect(kim.ifLike(Dev.Jeroen, 'kimvanwilgen')).toBe(kim);
  });

  test('type', () => {
    expect(text('').parse(Dev.Sander)).toMatchText('');
    expect(text('{type}').parse(undefined)).toMatchText('');
    expect(text('{type}').parse(Dev.Sander)).toMatchText('dev');
    expect(text('{type.title}').parse(Dev.Sander)).toMatchText('Dev');
  });

  test('subject', () => {
    expect(text('{this}').parse(undefined)).toMatchText('');
    expect(text('{this.name}').parse(Dev.Sander)).toMatchText('Sander');
  });

  test('actual', () => {
    expect(text('{actual}').parse(Dev.Sander, { actual: 'good' })).toMatchText('good');
    expect(text('{actual.upper}').parse(Dev.Sander, { actual: 'good' })).toMatchText('GOOD');
  });

  test('property', () => {
    expect(text('{property}').parse(Dev.Sander, { property: 'name' })).toMatchText('name');
    expect(text('{property.title}').parse(Dev.Sander, { property: 'name' })).toMatchText('Name');
  });

  const template = '{this.level} {this.name} {this.language.lower.title} {this.language.lower} {type} {property.upper} {actual.lower}';

  test('the full monty', () => {
    expect(
      text(template).parse(Dev.Jeroen, {
        property: 'language',
        actual: 'C',
      })
    ).toMatchText('3 Jeroen Typescript typescript dev LANGUAGE c');
  });

  test('space', () => {
    expect(text('').space).toMatchText('');
    expect(text('Jeroen').space).toMatchText('Jeroen');
    expect(text('NaoufalLamarti').space).toMatchText('Naoufal Lamarti');
    expect(text('Jeroen Dev').space).toMatchText('Jeroen Dev');
    expect(text('JEROEN_DEV').space).toMatchText('JEROEN DEV');
    expect(text('Jeroen.Plug').space).toMatchText('Jeroen.Plug');
    expect(text('Jeroen-Plug').space).toMatchText('Jeroen Plug');
    expect(text('Jeroen_Plug').space).toMatchText('Jeroen Plug');
    expect(text('Jeroen0123').space).toMatchText('Jeroen0123');
    expect(text('Jeroen0123Plug').space).toMatchText('Jeroen0123 Plug');
    expect(text('JeroenHTML').space).toMatchText('Jeroen HTML');
    expect(text('JeroenHTML Plug').space).toMatchText('Jeroen HTML Plug');
    expect(text('JeroenHtmlPlug').space).toMatchText('Jeroen Html Plug');
  });

  test('sentence', () => {
    expect(text().sentence).toMatchText('');
    expect(text('').sentence).toMatchText('');
    expect(text('hallo').sentence).toMatchText('Hallo.');
    expect(text('hallo wij zijn de heidezangers').sentence).toMatchText('Hallo wij zijn de heidezangers.');
  });
});
