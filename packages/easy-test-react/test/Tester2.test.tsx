import React from 'react';
import { renders } from '../src';
import '@thisisagile/easy-test';

describe('Tester', () => {
  const a = <div className={'blue'} />;

  const form = (
    <form>
      <input name={'first'} defaultValue={'Sander'} />
      <select name={'country'} defaultValue={'nl'}>
        <option value={'nl'}>NL</option>
      </select>
      <textarea name={'bio'} defaultValue={'Writes code'} />
      <input name={'phone'} defaultValue={'+31612345678'} />
      <input name={'phone'} defaultValue={'+31612345679'} />
      <button name={'action'}>Go</button>
    </form>
  );

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

  test('byField finds an input by name', () => {
    expect(renders(form).byField('first')).toBeDefined();
  });

  test('byField finds a select and a textarea by name', () => {
    const t = renders(form);
    expect(t.byField('country').tagName).toBe('SELECT');
    expect(t.byField('bio').tagName).toBe('TEXTAREA');
  });

  test('byField skips elements that take no input', () => {
    expect(renders(form).byField('action')).toBeUndefined();
  });

  test('byField takes the field at the index', () => {
    const t = renders(form);
    expect(t.atField('phone').value).toBe('+31612345678');
    expect(t.atField('phone', 1).value).toBe('+31612345679');
  });

  test('atField', () => {
    const t = renders(form);
    expect(t.atField('first')).toBeValid();
    expect(t.atField('last')).not.toBeValid();
  });

  test('atField types and blurs the field it found', () => {
    const t = renders(form);
    t.atField('first').type('Wouter');
    expect(t.atField('first').value).toBe('Wouter');
    expect(t.atField('first').blur()).toBeValid();
  });
});
