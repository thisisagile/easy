import '@thisisagile/easy-test';
import locales from '../../../src/domain/enums/locales.json';
import { meta, text, toList } from '@thisisagile/easy';
import { Locale } from '../../../src';

describe('Locale', () => {
  test('Generate locale from json.', () => {
    // Credits to https://github.com/umpirsky/locale-list/
    const output = meta(locales)
      .entries()
      .reduce((a, [k, v]) => {
        a[k] = `static readonly ${text(k).upper} = new Locale('${k}', '${v}');`;
        return a;
      }, {} as any);
    expect(meta(output).entries()).toHaveLength(563);
  });

  test('id and name matches.', () => {
    expect(Locale.NL.id).toBe('nl');
    expect(Locale.NL.name).toMatchText('Dutch');
    expect(Locale.NL_NL.name).toMatchText('Dutch (Netherlands)');
    expect(Locale.NL_BE.name).toMatchText('Dutch (Belgium)');
  });

  test('byId is not case sensitive and accepts both dashes as well as underscores.', () => {
    expect(Locale.byId('nl_NL')).toBe(Locale.NL_NL);
    expect(Locale.byId('nl_nl')).toBe(Locale.NL_NL);
    expect(Locale.byId('nl-nl')).toBe(Locale.NL_NL);
    expect(Locale.byId('nl,nl')).toBe(Locale.NL_NL);
    expect(Locale.byId('nlnl')).toBe(Locale.NL_NL);
  });

  test('byIds.', () => {
    expect(Locale.byIds<Locale>(['nl-nl'])).toMatchText(toList<Locale>(Locale.NL_NL));
  });

  test('equals.', () => {
    expect(Locale.NL_NL.equals(Locale.NL_NL)).toBeTruthy();
  });
});
