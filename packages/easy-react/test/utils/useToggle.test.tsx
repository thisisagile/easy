import { act, renderHook } from '@testing-library/react';
import { mock } from '@thisisagile/easy-test';
import { useToggle } from '../../src';
import { rendersWait } from '@thisisagile/easy-test-react';
import React, { useEffect } from 'react';

const ToggleHook = () => {
  const [toggle, setToggle] = useToggle(false);
  const [, setVisible] = useToggle();

  useEffect(() => {
    setToggle();
    setVisible();
  }, []);
  return <div id={'42'}>{`${toggle}`}</div>;
};

describe('useToggle', () => {
  test('component with useToggle hook renders correctly as default value is false.', async () => {
    const { container, byText } = await rendersWait(<ToggleHook />);
    expect(container).toMatchSnapshot();
    expect(byText('true')).toBeDefined();
  });

  test('starts false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  test('starts at the given initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  describe('toggle', () => {
    test('flips state', () => {
      const { result } = renderHook(() => useToggle());
      act(() => result.current[1]());
      expect(result.current[0]).toBe(true);
    });

    test('flips back on second call', () => {
      const { result } = renderHook(() => useToggle());
      act(() => {
        result.current[1]();
        result.current[1]();
      });
      expect(result.current[0]).toBe(false);
    });
  });

  describe('flip', () => {
    test('flips to true, runs fn, then flips back after fn resolves', async () => {
      const { result } = renderHook(() => useToggle());
      const fn = mock.resolve();
      await act(() => result.current[2](fn));
      expect(fn).toHaveBeenCalled();
      expect(result.current[0]).toBe(false);
    });

    test('flips back even when fn rejects', async () => {
      const { result } = renderHook(() => useToggle());
      const fn = mock.reject(new Error('fail'));
      await act(() => result.current[2](fn).catch(() => {}));
      expect(result.current[0]).toBe(false);
    });

    test('state is true while fn is pending', async () => {
      const { result } = renderHook(() => useToggle());
      let resolve: () => void;
      const fn = mock.impl(
        () =>
          new Promise<void>(r => {
            resolve = r;
          })
      );
      act(() => {
        void result?.current[2](fn);
      });
      expect(result.current[0]).toBe(true);
      await act(() => {
        resolve();
        return Promise.resolve();
      });
      expect(result.current[0]).toBe(false);
    });
  });
});
