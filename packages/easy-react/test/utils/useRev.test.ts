import { act, renderHook } from '@testing-library/react';
import { useRev } from '../../src';

describe('useRev', () => {
  test('starts at 0 by default', () => {
    const { result } = renderHook(() => useRev());
    expect(result.current.rev).toBe(0);
  });

  test('starts at the given initial value', () => {
    const { result } = renderHook(() => useRev(5));
    expect(result.current.rev).toBe(5);
  });

  test('revalidate increments rev', () => {
    const { result } = renderHook(() => useRev());
    act(() => result.current.revalidate());
    expect(result.current.rev).toBe(1);
  });

  test('revalidate increments rev on each call', () => {
    const { result } = renderHook(() => useRev());
    act(() => {
      result.current.revalidate();
      result.current.revalidate();
    });
    expect(result.current.rev).toBe(2);
  });

  test('reset returns rev to the default initial value', () => {
    const { result } = renderHook(() => useRev());
    act(() => {
      result.current.revalidate();
      result.current.revalidate();
    });
    act(() => result.current.reset());
    expect(result.current.rev).toBe(0);
  });

  test('reset returns rev to the given initial value', () => {
    const { result } = renderHook(() => useRev(3));
    act(() => {
      result.current.revalidate();
      result.current.revalidate();
    });
    act(() => result.current.reset());
    expect(result.current.rev).toBe(3);
  });
});
