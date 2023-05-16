import { asJson, asString, toArray } from '../utils/Utils';
import { eq } from '../utils/Eq';
import { AsymmetricMatcher } from 'expect';
import { Uri } from '../utils/Types';

export class ObjectContainingText extends AsymmetricMatcher<string> {
  asymmetricMatch(other: any) {
    return asString(other).includes(asString(this.sample));
  }

  toString() {
    return `String${this.inverse ? 'Not' : ''}Containing`;
  }
}

export class ObjectContainingTextExact extends AsymmetricMatcher<string> {
  asymmetricMatch(other: any) {
    return asString(other) === asString(this.sample);
  }

  toString() {
    return `String${this.inverse ? 'Not' : ''}Containing`;
  }
}

export class ObjectContainingJson extends AsymmetricMatcher<any> {
  asymmetricMatch(other: any) {
    return eq.subset(asJson(other), asJson(this.sample));
  }

  toString() {
    return `Object${this.inverse ? 'Not' : ''}Containing`;
  }
}

export const fits = {
  any: (): any => expect.anything(),
  type: (type?: unknown): any => expect.any(type),
  with: (o: unknown): any => expect.objectContaining(o),
  text: (s: any): any => new ObjectContainingText(s),
  textExact: (s: any): any => new ObjectContainingTextExact(s),
  uri: (u: Uri): any => fits.textExact(u),
  json: (s: any): any => new ObjectContainingJson(s),
  items: (...items: any[]): any => expect.arrayContaining(toArray(...items)),
};
