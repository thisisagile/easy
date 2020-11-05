import { Dev } from '../ref/Dev';
import { Results, when } from '../../src/validation';

describe('Testing When', () => {

  test('Construct when', () => {
    expect(when(Dev.Sander).result).toBeTruthy();
    expect(when(Dev.Sander).not.result).toBeFalsy();
    expect(when(Dev.Sander).not.not.result).toBeTruthy();
    expect(when(Dev.Sander).not.not.not.result).toBeFalsy();
  });

  test('Construct with real object and isDefined', () => {
    expect(when(Dev.Sander).isDefined.result).toBeTruthy();
    expect(when(Dev.Sander).not.isDefined.result).toBeFalsy();
    expect(when(Dev.Sander).not.not.isDefined.result).toBeTruthy();
    expect(when(Dev.Sander).not.not.not.isDefined.result).toBeFalsy();
  });

  test('Construct with real object and isIn', () => {
    expect(when(Dev.Sander).in().result).toBeFalsy();
    expect(when(Dev.Sander).in(Dev.Sander).result).toBeTruthy();
    expect(when(Dev.Sander).in(Dev.Wouter, Dev.Jeroen).result).toBeFalsy();
    expect(when(Dev.Sander).in(Dev.Wouter, Dev.Jeroen, Dev.Sander).result).toBeTruthy();
    expect(when(Dev.Sander).not.in(Dev.Jeroen).result).toBeTruthy();
  });

  test('Construct, isDefined and reject', async () => {
    expect(Dev.Invalid.isValid).toBeFalsy();
    expect(when(Dev.Invalid).not.isValid.result).toBeTruthy();
    await expect(when(Dev.Invalid).not.isValid.reject('Is wrong')).rejects.toBeInstanceOf(Results);
    await expect(when(undefined).not.isDefined.reject('Is wrong')).rejects.toBeInstanceOf(Results);
    return expect(when(Dev.Sander).not.isDefined.reject('Is wrong')).resolves.toBe(Dev.Sander);
  });

  test('Construct, isDefined and recover', async () => {
    await expect(when(Dev.Sander).isDefined.recover(l => l)).resolves.toBe(Dev.Sander);
    await expect(when(undefined).not.isDefined.recover(() => Dev.Jeroen)).resolves.toBe(Dev.Jeroen);
    return expect(when(Dev.Sander).not.isDefined.recover(() => Dev.Jeroen)).resolves.toBe(Dev.Sander);
  });

  test('Construct with undefined object and isDefined', () => {
    expect(when(undefined).isDefined.result).toBeFalsy();
    expect(when(undefined).not.isDefined.result).toBeTruthy();
  });

  test('Construct with undefined object and isEmpty', () => {
    expect(when('no').isEmpty.result).toBeFalsy();
    expect(when('no').not.isEmpty.result).toBeTruthy();
  });

  test('Construct and isTrue', () => {
    expect(when('sander').isTrue.result).toBeTruthy();
    expect(when(undefined).not.isTrue.result).toBeTruthy();
    expect(when({}).isTrue.result).toBeTruthy();
    expect(when(Dev.Sander).isTrue.result).toBeTruthy();
    expect(when(true).isTrue.result).toBeTruthy();
    expect(when(false).not.isTrue.result).toBeTruthy();
  });

  test('validation', async () => {
    expect(when(Dev.Sander).isValid.result).toBeTruthy();
    expect(when(undefined).not.isValid.result).toBeTruthy();
    return expect(when(Dev.Wouter).not.isValid.result).toBeFalsy();
    // return expect(when(Dev.Wouter).not.isValidated.reject("test")).rejects.toFailWith(Dev.Wouter.name);
  });

  test('Construct with undefined object and isInstanceOf', () => {
    expect(when(Dev.Jeroen).isInstance(Dev).result).toBeTruthy();
    expect(when(undefined).not.isInstance(Dev).result).toBeTruthy();
  });

  test('Construct with undefined object and has', () => {
    expect(when(Dev.Jeroen).with(d => d.language === Dev.Jeroen.language).result).toBeTruthy();
    expect(when(Dev.Jeroen).with(d => d.language === '').result).toBeFalsy();
  });
});
