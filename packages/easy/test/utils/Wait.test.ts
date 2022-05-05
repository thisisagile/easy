import { Wait, wait } from '../../src';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('Wait', () => {
  test('wait call milli', () => {
    void wait(300);
    jest.advanceTimersByTime(300);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300);
    jest.runAllTimers();
  });

  test('wait call second', () => {
    void Wait.seconds(2);
    jest.advanceTimersByTime(2000);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000);
    jest.runAllTimers();
  });
});
