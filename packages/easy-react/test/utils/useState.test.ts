import { act, renderHook } from '@testing-library/react';
import { useState } from '../../src';

describe('useReset', () => {
  test('starts undefined by default', () => {
    const { result } = renderHook(() => useState());
    expect(result.current[0]).toBeUndefined();
  });

  test('starts at the given initial value', () => {
    const { result } = renderHook(() => useState('hello'));
    expect(result.current[0]).toBe('hello');
  });

  test('setState updates the value', () => {
    const { result } = renderHook(() => useState('hello'));
    act(() => result.current[1]('world'));
    expect(result.current[0]).toBe('world');
  });

  test('reset returns to the initial value', () => {
    const { result } = renderHook(() => useState('hello'));
    act(() => result.current[1]('world'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('hello');
  });

  test('reset returns to undefined when no initial was given', () => {
    const { result } = renderHook(() => useState<string>());
    act(() => result.current[1]('world'));
    act(() => result.current[2]());
    expect(result.current[0]).toBeUndefined();
  });
});
