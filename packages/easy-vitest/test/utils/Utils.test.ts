import { describe, expect, test } from 'vitest';
import { asJson } from '../../src/utils/Utils';

class Dev {
  constructor(readonly name: string) {}
}

describe('asJson', () => {
  test('works', () => {
    expect(asJson()).toBeUndefined();
    expect(asJson('')).toBeUndefined();
    expect(asJson(3)).toBeUndefined();
    expect(asJson({})).toMatchObject({});
    expect(asJson({ id: 3 })).toMatchObject({ id: 3 });
    expect(asJson(new Dev('Wouter'))).toMatchObject({ name: 'Wouter' });
  });
});
