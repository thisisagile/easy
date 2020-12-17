import { isDefined, Message, ofMessage, Results, results } from '../types';

export class Match<S = unknown> {
  constructor(private readonly subject: S, private readonly failed = false, private readonly message: Message<S> = '') {}

  not(p: (s: S) => boolean, message: Message<S>): Match<S> {
    if (this.failed) return this;
    try {
      return new Match<S>(this.subject, !p(this.subject), ofMessage(message, this.subject));
    } catch (e) {
      return new Match<S>(this.subject, true, e.message);
    }
  }

  undefined(p: (s: S) => any, message: Message<S>): Match<S> {
    return this.not(() => isDefined(p(this.subject)), message);
  }

  get results(): Results { return this.failed ? results(ofMessage(this.message, this.subject)) : results(); }
}

export const match = <S = unknown>(subject: S): Match<S> => new Match<S>(subject);
