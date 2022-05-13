import { ErrorOrigin, Exception } from '../types';
import { when } from '../validation';
import { wait } from './Wait';

export class Retry<T = any> {
  constructor(readonly subject: () => Promise<T>, readonly times = 3, readonly interval = 1000, readonly prevError?: ErrorOrigin) {}

  run = (): Promise<T> =>
    when(this.times)
      .not.isTrue.reject(this.prevError ?? Exception.CouldNotExecute)
      .then(() =>
        this.subject().catch(async e => {
          await wait(this.interval);
          return new Retry<T>(this.subject, this.times - 1, this.interval, e).run();
        })
      );
}

export const retry = <T>(subject: () => Promise<T>, times?: number, interval?: number, prevError?: ErrorOrigin): Promise<T> =>
  new Retry<T>(subject, times, interval, prevError).run();
