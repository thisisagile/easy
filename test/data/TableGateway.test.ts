import { TableGateway } from '../../src';
import { DevTableGateway } from '../ref';

describe('TableGateway', () => {
  let target: DevTableGateway;

  beforeEach(() => {
    target = new DevTableGateway();
  });

  test('It works', () => {
    expect(target).toBeDefined();
  });
});
