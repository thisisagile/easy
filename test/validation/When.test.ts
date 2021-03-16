import { Dev, Language } from '../ref';
import { Exception, Results, when } from '../../src';
import '@thisisagile/easy-test';

describe('Testing When', () => {
  test('Construct when', () => {
    expect(when(Dev.Sander).valid).toBeTruthy();
    expect(when(Dev.Sander).not.valid).toBeFalsy();
    expect(when(Dev.Sander).not.not.valid).toBeTruthy();
    expect(when(Dev.Sander).not.not.not.valid).toBeFalsy();
  });

  test('Construct with real object and isDefined', () => {
    expect(when(Dev.Sander).isDefined.valid).toBeTruthy();
    expect(when(Dev.Sander).not.isDefined.valid).toBeFalsy();
    expect(when(Dev.Sander).not.not.isDefined.valid).toBeTruthy();
    expect(when(Dev.Sander).not.not.not.isDefined.valid).toBeFalsy();
  });

  test('Construct with real object and isIn', () => {
    expect(when(Dev.Sander).in().valid).toBeFalsy();
    expect(when(Dev.Sander).in(Dev.Sander).valid).toBeTruthy();
    expect(when(Dev.Sander).in(Dev.Wouter, Dev.Jeroen).valid).toBeFalsy();
    expect(when(Dev.Sander).in(Dev.Wouter, Dev.Jeroen, Dev.Sander).valid).toBeTruthy();
    expect(when(Dev.Sander).not.in(Dev.Jeroen).valid).toBeTruthy();
  });

  test('Construct, isDefined and reject', async () => {
    expect(when(undefined).not.isDefined.valid).toBeTruthy();
    await expect(when(Dev.Invalid).not.isValid.reject('Is wrong')).rejects.not.toBeValid();
    await expect(when(undefined).not.isDefined.reject('Is wrong')).rejects.not.toBeValid();
    return expect(when(Dev.Sander).not.isDefined.reject('Is wrong')).resolves.toMatchObject(Dev.Sander);
  });

  test('Construct, isDefined and recover', async () => {
    await expect(when(Dev.Sander).isDefined.recover(l => l)).resolves.toMatchObject(Dev.Sander);
    await expect(when((undefined as unknown) as Dev).not.isDefined.recover(() => Dev.Jeroen)).resolves.toMatchObject(Dev.Jeroen);
    await expect(when(Dev.Invalid).not.isValid.recover(() => Dev.Jeroen)).resolves.toMatchObject(Dev.Jeroen);
    return expect(when(Dev.Sander).not.isDefined.recover(() => Dev.Jeroen)).resolves.toMatchObject(Dev.Sander);
  });

  test('Construct with undefined object and isDefined', () => {
    expect(when(undefined).isDefined.valid).toBeFalsy();
    expect(when(undefined).not.isDefined.valid).toBeTruthy();
  });

  test('Construct with undefined object and is', () => {
    expect(when(Dev.Sander).is(Dev.Sander).valid).toBeTruthy();
    expect(when(Dev.Wouter).is(Dev.Jeroen).valid).toBeFalsy();
  });

  test('Construct with undefined object and isEmpty', () => {
    expect(when('no').isEmpty.valid).toBeFalsy();
    expect(when('no').not.isEmpty.valid).toBeTruthy();
  });

  test('Construct and isTrue', () => {
    expect(when('sander').isTrue.valid).toBeTruthy();
    expect(when(undefined).not.isTrue.valid).toBeTruthy();
    expect(when({}).isTrue.valid).toBeTruthy();
    expect(when(Dev.Sander).isTrue.valid).toBeTruthy();
    expect(when(true).isTrue.valid).toBeTruthy();
    expect(when(false).not.isTrue.valid).toBeTruthy();
  });

  test('validation', () => {
    expect(when(Dev.Sander).isValid.valid).toBeTruthy();
    expect(when(undefined).isValid.valid).toBeFalsy();
    expect(when(undefined).not.isValid.valid).toBeTruthy();
    return expect(when(Dev.Wouter).not.isValid.valid).toBeFalsy();
  });

  test('Construct with undefined object and isInstanceOf', () => {
    expect(when(Dev.Jeroen).isInstance(Dev).valid).toBeTruthy();
    expect(when(undefined).not.isInstance(Dev).valid).toBeTruthy();
  });

  test('Construct with undefined object and has', () => {
    expect(when(Dev.Jeroen).with(d => d.language === Dev.Jeroen.language).valid).toBeTruthy();
    expect(when(Dev.Jeroen).with(d => d.language === '').valid).toBeFalsy();
  });

  test('Contains', () => {
    expect(when(Dev.Jeroen).contains(d => d.language).valid).toBeTruthy();
    expect(when(Dev.Invalid).contains(d => d.name).valid).toBeFalsy();
  });

  test('Contains and', async () => {
    await expect(
      when(Dev.Jeroen)
        .not.contains(d => d.language)
        .and.contains(d => d.name)
        .reject(Exception.Unknown)
    ).resolves.toBe(Dev.Jeroen);
    await expect(
      when(Dev.Invalid)
        .not.contains(d => d.level)
        .and.contains(d => d.name)
        .reject(Exception.Unknown)
    ).rejects.toMatchException(Exception.Unknown);
    return expect(
      when(Dev.Invalid)
        .not.contains(d => d.language)
        .and.contains(d => d.name)
        .reject(Exception.Unknown)
    ).rejects.toMatchException(Exception.Unknown);
  });

  test('Reject without error, with error, with exception, with function', async () => {
    let res = await when(Dev.Invalid)
      .not.isValid.reject()
      .catch(r => r);
    expect(res).toBeInstanceOf(Results);

    res = await when(Dev.Invalid)
      .not.isValid.reject('Is wrong')
      .catch(r => r);
    expect(res).toBe('Is wrong');

    res = await when(Dev.Invalid)
      .not.isValid.reject(d => d.language)
      .catch(r => r);
    expect(res).toBe(Dev.Invalid.language);

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
