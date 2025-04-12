import React from 'react';
import { renders } from '../src';
import '@thisisagile/easy-test';

describe('Tester', () => {
  const a = <div className={'blue'} />;

  test('byQuery', () => {
    const t = renders(a);
    const el = t.byQuery('.blue');
    const el2 = t.byQuery('.red');
    expect(el).toBeDefined();
    expect(el2).toBeUndefined();
  });

  test('atQuery', () => {
    const t = renders(a);
    const el = t.atQuery('.blue');
    const el2 = t.atQuery('.red');
    expect(el).toBeValid();
    expect(el2).not.toBeValid();
  });
});
