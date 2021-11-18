import '@thisisagile/easy-test';
import locales from '../../../src/domain/enums/locales.json';
import { meta, text } from '@thisisagile/easy';
import { Locale } from '../../../src';

describe('Locale', () => {
  test('Generate locale from json', () => {
    // Credits to https://github.com/umpirsky/locale-list/
    const output = meta(locales)
      .entries()
      .reduce((a, [k, v]) => {
        a[k] = `static readonly ${text(k).upper} = new Locale('${k}', '${v}');`;
        return a;
      }, {} as any);
    expect(meta(output).entries()).toHaveLength(563);
  });

  test('', () => {
    expect(Locale.NL.id).toBe('nl');
    expect(Locale.NL.name).toMatchText('Dutch');
    expect(Locale.NL_NL.name).toMatchText('Dutch (Netherlands)');
    expect(Locale.NL_BE.name).toMatchText('Dutch (Belgium)');
  });
});
