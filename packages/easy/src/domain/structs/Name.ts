import { Struct } from '../Struct';
import { required } from '../../validation';
import { Json, text } from '../../types';

export class Name extends Struct {
  @required() readonly first: string = this.state.first;
  readonly middle: string = this.state.middle;
  @required() readonly last: string = this.state.last;

  toString(): string {
    return text(this.first, '').add(this.middle, ' ').add(this.last, ' ').toString();
  }
}

export const name = (n?: Json): Name => new Name(n);
