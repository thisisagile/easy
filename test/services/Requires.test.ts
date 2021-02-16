import { meta, Scope, UseCase } from '../../src';
import { DevResource, DevsResource } from '../ref';

describe('Requires', () => {
  test('token is required', () => {
    const token: boolean = meta(new DevResource()).property('upsert').get('token');
    expect(token).toBeTruthy();
  });

  test('token is not required', () => {
    const token: boolean = meta(new DevsResource()).property('insert').get('token');
    expect(token).toBeFalsy();
  });

  test('scope is set', () => {
    const token: boolean = meta(new DevResource()).property('byId').get('token');
    const scope: Scope = meta(new DevResource()).property('byId').get('scope');
    expect(token).toBeTruthy();
    expect(scope).toMatchObject(Scope.Basic);
  });

  test('scope is not set', () => {
    const scope: Scope = meta(new DevResource()).property('upsert').get('scope');
    expect(scope).toBeUndefined();
  });

  test('useCase is set', () => {
    const token: boolean = meta(new DevResource()).property('update').get('token');
    const uc: UseCase = meta(new DevResource()).property('update').get('uc');
    expect(token).toBeTruthy();
    expect(uc).toMatchObject(UseCase.ChangePassword);
  });

  test('useCase is not set', () => {
    const uc: UseCase = meta(new DevResource()).property('upsert').get('uc');
    expect(uc).toBeUndefined();
  });
});
