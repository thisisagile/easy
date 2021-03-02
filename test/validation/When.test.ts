import { Dev, Language } from '../ref';
import { Exception, Results, when } from '../../src';
import '@thisisagile/easy-test';

describe('Testing When', () => {
  test('Construct when', () => {
    expect(when(Dev.Sander).invalid).toBeTruthy();
    expect(when(Dev.Sander).not.invalid).toBeFalsy();
    expect(when(Dev.Sander).not.not.invalid).toBeTruthy();
    expect(when(Dev.Sander).not.not.not.invalid).toBeFalsy();
  });

  test('Construct with real object and isDefined', () => {
    expect(when(Dev.Sander).isDefined.invalid).toBeTruthy();
    expect(when(Dev.Sander).not.isDefined.invalid).toBeFalsy();
    expect(when(Dev.Sander).not.not.isDefined.invalid).toBeTruthy();
    expect(when(Dev.Sander).not.not.not.isDefined.invalid).toBeFalsy();
  });

  test('Construct with real object and isIn', () => {
    expect(when(Dev.Sander).in().invalid).toBeFalsy();
    expect(when(Dev.Sander).in(Dev.Sander).invalid).toBeTruthy();
    expect(when(Dev.Sander).in(Dev.Wouter, Dev.Jeroen).invalid).toBeFalsy();
    expect(when(Dev.Sander).in(Dev.Wouter, Dev.Jeroen, Dev.Sander).invalid).toBeTruthy();
    expect(when(Dev.Sander).not.in(Dev.Jeroen).invalid).toBeTruthy();
  });

  test('Construct, isDefined and reject', async () => {
    expect(when(undefined).not.isDefined.invalid).toBeTruthy();
    await expect(when(Dev.Invalid).not.isValid.reject('Is wrong')).rejects.not.toBeValid();
    await expect(when(undefined).not.isDefined.reject('Is wrong')).rejects.not.toBeValid();
    return expect(when(Dev.Sander).not.isDefined.reject('Is wrong')).resolves.toMatchObject(Dev.Sander);
  });

  test('Construct, isDefined and recover', async () => {
    await expect(when(Dev.Sander).isDefined.recover(l => l)).resolves.toMatchObject(Dev.Sander);
    await expect(when(undefined).not.isDefined.recover(() => Dev.Jeroen)).resolves.toMatchObject(Dev.Jeroen);
    await expect(when(Dev.Invalid).not.isValid.recover(() => Dev.Jeroen)).resolves.toMatchObject(Dev.Jeroen);
    return expect(when(Dev.Sander).not.isDefined.recover(() => Dev.Jeroen)).resolves.toMatchObject(Dev.Sander);
  });

  test('Construct with undefined object and isDefined', () => {
    expect(when(undefined).isDefined.invalid).toBeFalsy();
    expect(when(undefined).not.isDefined.invalid).toBeTruthy();
  });

  test('Construct with undefined object and is', () => {
    expect(when(Dev.Sander).is(Dev.Sander).invalid).toBeTruthy();
    expect(when(Dev.Wouter).is(Dev.Jeroen).invalid).toBeFalsy();
  });

  test('Construct with undefined object and isEmpty', () => {
    expect(when('no').isEmpty.invalid).toBeFalsy();
    expect(when('no').not.isEmpty.invalid).toBeTruthy();
  });

  test('Construct and isTrue', () => {
    expect(when('sander').isTrue.invalid).toBeTruthy();
    expect(when(undefined).not.isTrue.invalid).toBeTruthy();
    expect(when({}).isTrue.invalid).toBeTruthy();
    expect(when(Dev.Sander).isTrue.invalid).toBeTruthy();
    expect(when(true).isTrue.invalid).toBeTruthy();
    expect(when(false).not.isTrue.invalid).toBeTruthy();
  });

  test('validation', () => {
    expect(when(Dev.Sander).isValid.invalid).toBeTruthy();
    expect(when(undefined).not.isValid.invalid).toBeTruthy();
    return expect(when(Dev.Wouter).not.isValid.invalid).toBeFalsy();
  });

  test('Construct with undefined object and isInstanceOf', () => {
    expect(when(Dev.Jeroen).isInstance(Dev).invalid).toBeTruthy();
    expect(when(undefined).not.isInstance(Dev).invalid).toBeTruthy();
  });

  test('Construct with undefined object and has', () => {
    expect(when(Dev.Jeroen).with(d => d.language === Dev.Jeroen.language).invalid).toBeTruthy();
    expect(when(Dev.Jeroen).with(d => d.language === '').invalid).toBeFalsy();
  });

  test('Reject without error, with error, with exception', async () => {
    let res = await when(Dev.Invalid)
      .not.isValid.reject()
      .catch(r => r);
    expect(res).toBeInstanceOf(Results);
    res = await when(Dev.Invalid)
      .not.isValid.reject('Is wrong')
      .catch(r => r);
    expect(res).toBe('Is wrong');
    res = await when(Dev.Invalid)
      .not.isValid.reject(Exception.DoesNotExist)
      .catch(r => r);
    expect(res).toBeInstanceOf(Exception);
    res = await when(Language.byId(42))
      .not.isValid.reject()
      .catch(r => r);
    expect(res).toHaveLength(1);
  });
});
