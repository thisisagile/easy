import { State } from '../../src';
import { Dev } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('State', () => {
  class MyState extends State {
    value = () => Dev.Jeroen;
    dev = () => this.get('dev', this.value);
    devFunction = () => this.get('dev', () => this.value());
    setDev2 = (d: Dev): Dev => this.set('dev2', d);
    getDev2 = (): Dev | undefined => this.get('dev2');
  }

  let state: MyState;

  beforeEach(() => {
    state = new MyState();
  });

  test('get works', () => {
    const res = state.dev();
    expect(res).toBe(Dev.Jeroen);
  });

  test('get works repeatedly without calling again', () => {
    state.value = mock.return(Dev.Wouter);
    const res = state.dev();
    expect(res).toBe(Dev.Wouter);
    state.dev();
    state.dev();
    expect(state.value).toHaveBeenCalledTimes(1);
  });

  test('get works repeatedly with function without calling again', () => {
    state.value = mock.return(Dev.Naoufal);
    const res = state.devFunction();
    expect(res).toBe(Dev.Naoufal);
    state.devFunction();
    state.devFunction();
    expect(state.value).toHaveBeenCalledTimes(1);
  });

  test('set works', () => {
    const res = state.setDev2(Dev.Sander);
    expect(res).toBe(Dev.Sander);
    expect(state.getDev2()).toBe(Dev.Sander);
  });
});
