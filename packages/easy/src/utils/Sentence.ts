import type { Text } from '../types/Text';
import { Id } from '../types/Id';
import { text } from '../types/ToText';

export class Sentence implements Text {
  constructor(
    word: Text,
    pre?: Sentence,
    private sentence: Text[] = (pre?.sentence ?? []).concat(word)
  ) {}

  toString(): string {
    return text(this.sentence.join(' ')).sentence.toString();
  }
}

class Topic extends Sentence {
  it = new Sentence('it', this);
  anything = new Sentence('anything', this);
  id = (id: Id) => new Sentence(`id '${id}'`, this);
  your = (subject?: Text) => new Sentence(`your ${subject ?? 'item'}`, this);
  a = (subject?: Text) => new Sentence(subject ? `a ${subject}` : 'an item', this);
  an = (subject?: Text) => new Sentence(`an ${subject ?? 'item'}`, this);
  any = (subjects?: Text) => new Sentence(`any ${subjects ?? 'items'}`, this);
}

class Verb extends Sentence {
  add = new Topic('add', this);
  check = new Topic('check', this);
  fetch = new Topic('fetch', this);
  find = new Topic('find', this);
  like = new Topic('like', this);
  process = new Topic('process', this);
  remove = new Topic('remove', this);
  translate = new Topic('translate', this);
  update = new Topic('update', this);
  validate = new Topic('validate', this);
}

class Not extends Verb {}

class SupportVerb extends Verb {
  not = new Not('not', this);
}

class We extends Sentence {
  could = new SupportVerb('could', this);
  did = new SupportVerb('did', this);

  added = new Topic('added', this);
  checked = new Topic('checked', this);
  fetched = new Topic('fetched', this);
  found = new Topic('found', this);
  liked = new Topic('liked', this);
  processed = new Topic('processed', this);
  removed = new Topic('removed', this);
  translated = new Topic('translated', this);
  updated = new Topic('updated', this);
  validated = new Topic('validated', this);
}

export const we = new We('we');
