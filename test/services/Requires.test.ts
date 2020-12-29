import { meta, Scope, UseCase } from '../../src';
import { DevResource, DevsResource } from '../ref';

describe('Requires', () => {
  test('token is required', () => {
    const all: boolean = meta(new DevsResource()).property('all').get('token');
    expect(all).toBeTruthy();
  });

  test('token is not required', () => {
    const insert: boolean = meta(new DevsResource()).property('insert').get('token');
    expect(insert).toBeFalsy();
  });

  test('scope is set', () => {
    const scope: Scope = meta(new DevResource()).property('byId').get('scope');
    expect(scope).toMatchObject(Scope.Basic);
  });

  test('scope is not set', () => {
    const scope: Scope = meta(new DevResource()).property('upsert').get('scope');
    expect(scope).toBeUndefined();
  });

  test('useCase is set', () => {
    const uc: UseCase = meta(new DevResource()).property('update').get('uc');
    expect(uc).toMatchObject(UseCase.ChangePassword);
  });

  test('useCase is not set', () => {
    const uc: UseCase = meta(new DevResource()).property('upsert').get('uc');
    expect(uc).toBeUndefined();
  });
});
