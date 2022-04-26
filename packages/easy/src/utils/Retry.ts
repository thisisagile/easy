import { ErrorOrigin, Exception, when } from '@thisisagile/easy';

export class Wait {
  static wait(ms = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static seconds(s = 0) {
    return this.wait(s * 1000);
  }
}

export const wait = (millis: number) => Wait.wait(millis);

export class Retry<T = any> {
  constructor(readonly subject: () => Promise<T>, readonly times = 3, readonly interval = 1000, readonly prevError?: ErrorOrigin) {}

  run = (): Promise<T> =>
    when(this.times)
      .not.isTrue.reject(this.prevError ?? Exception.CouldNotExecute)
      .then(() =>
        this.subject().catch(async e => {
          await wait(this.interval);
          return retry(this.subject, this.times - 1, this.interval, e);
        })
      );
}

export const retry = <T>(subject: () => Promise<T>, times?: number, interval?: number, prevError?: ErrorOrigin): Promise<T> =>
  new Retry<T>(subject, times, interval, prevError).run();
