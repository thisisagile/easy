import { defaultExport } from '../../src/utils/defaultExport';

describe('defaultExport', () => {
  const isEven = (n: number): boolean => n % 2 === 0;

  test('returns a module that already is the function', () => {
    expect(defaultExport(isEven)(2)).toBe(true);
  });

  test('unwraps a module that carries the function as default, as strict ESM imports validator', () => {
    expect(defaultExport({ default: isEven })(3)).toBe(false);
  });
});
