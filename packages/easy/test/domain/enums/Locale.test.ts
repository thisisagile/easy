import '@thisisagile/easy-test';
import locales from '../../../src/domain/enums/locales.json';
import { meta, text, toList, Locale } from '../../../src';

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

  test('short matches.', () => {
    expect(Locale.NL.country).toBe('nl');
    expect(Locale.NL_NL.country).toMatchText('nl');
    expect(Locale.NL_BE.country).toMatchText('be');
    expect(Locale.AZ_LATN.country).toMatchText('az');
  });

  test('lookup is case insensitive and accepts both dashes as well as underscores.', () => {
    expect(Locale.lookup('nl_NL')).toBe(Locale.NL_NL);
    expect(Locale.lookup('nl_nl')).toBe(Locale.NL_NL);
    expect(Locale.lookup('nl-nl')).toBe(Locale.NL_NL);
    expect(Locale.lookup('nl,nl')).toBe(Locale.NL_NL);
    expect(Locale.lookup('nlnl')).toBe(Locale.NL_NL);
  });

  test('byId is case sensitive and accepts only the actual id.', () => {
    expect(Locale.byId('nl_NL')).toBe(Locale.NL_NL);
    expect(Locale.byId('nl_nl')).toBeUndefined();
    expect(Locale.byId('nl-nl')).toBeUndefined();
    expect(Locale.byId('nl,nl')).toBeUndefined();
    expect(Locale.byId('nlnl')).toBeUndefined();
  });

  test('byIds.', () => {
    expect(Locale.byIds<Locale>(['nl_NL'])).toMatchText(toList<Locale>(Locale.NL_NL));
  });

  test('equals.', () => {
    expect(Locale.NL_NL.equals(Locale.NL_NL)).toBeTruthy();
  });
});
