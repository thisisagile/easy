import { Id, text } from '../types';

export class Sentence {
  constructor(word: Text, pre?: Sentence, private sentence: Text[] = (pre?.sentence ?? []).concat(word)) {
  }

  toString(): string {
    return text(this.sentence.join(' ')).sentence.toString();
  }
}

class Topic extends Sentence {
  it = new Sentence('it', this);
  anything = new Sentence('anything', this);
  id = (id: Id) => new Sentence(`id '${id}'`, this);
  your = (subject?: unknown) => new Sentence(`your ${subject ?? 'item'}`, this);
  a = (subject?: unknown) => new Sentence(subject ? `a ${subject}` : 'an item', this);
  an = (subject?: unknown) => new Sentence(`an ${subject ?? 'item'}`, this);
  any = (subjects?: unknown) => new Sentence(`any ${subjects ?? 'items'}`, this);
}

class Verb extends Sentence {
  add = new Topic('add', this);
  check = new Topic('check', this);
  fetch = new Topic('fetch', this);
  find = new Topic('find', this);
  like = new Topic('like', this);
  remove = new Topic('remove', this);
  update = new Topic('update', this);
  validate = new Topic('validate', this);
}

class Not extends Verb {
}

class SupportVerb extends Verb {
  not = new Not('not', this);
}

class We extends Sentence {
  could = new SupportVerb('could', this);
  did = new SupportVerb('did', this);
}

export const we = new We('we');
