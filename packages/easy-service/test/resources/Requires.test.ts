import { meta, Scope, UseCase } from '@thisisagile/easy';
import { DevResource, DevsResource } from '../ref';
import { DevScope, DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';

describe('Requires', () => {
  test('token is required', () => {
    const token: boolean | undefined = meta(new DevResource()).property('upsert').get('token');
    expect(token).toBeTruthy();
  });

  test('token is not required', () => {
    const token: boolean | undefined = meta(new DevsResource()).property('insert').get('token');
    expect(token).toBeFalsy();
  });

  test('scope is set', () => {
    const token: boolean | undefined = meta(new DevResource()).property('byId').get('token');
    const scope: Scope | undefined = meta(new DevResource()).property('byId').get('scope');
    expect(token).toBeTruthy();
    expect(scope).toMatchObject(DevScope.Dev);
  });

  test('scope is not set', () => {
    const scope: Scope | undefined = meta(new DevResource()).property('upsert').get('scope');
    expect(scope).toBeUndefined();
  });

  test('useCase is set', () => {
    const token: boolean | undefined = meta(new DevResource()).property('update').get('token');
    const uc: UseCase | undefined = meta(new DevResource()).property('update').get('uc');
    expect(token).toBeTruthy();
    expect(uc).toMatchObject(DevUseCase.WriteCode);
  });

  test('useCase is not set', () => {
    const uc: UseCase | undefined = meta(new DevResource()).property('upsert').get('uc');
    expect(uc).toBeUndefined();
  });
});
