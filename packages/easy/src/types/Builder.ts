import { Constructor } from './Constructor';
import { asString } from './Text';

class builder {
  private static state: any = {};
  static singleton = <T>(ctr: Constructor<T>, ...args: any[]): T => builder.state[asString(ctr)] ?? (builder.state[asString(ctr)] = new ctr(...args));
  static reset = (): void => {
    builder.state = {};
  };
}

export const build = {
  singleton: <T>(ctr: Constructor<T>, ...args: any[]): T => builder.singleton(ctr, ...args),
  reset: (): void => builder.reset(),
};

export const singleton = <T>(ctr: Constructor<T>, ...args: any[]): T => build.singleton(ctr, ...args);
