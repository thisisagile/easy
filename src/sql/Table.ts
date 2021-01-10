import {Map} from "../utils";
import { Text } from '../types';
import { Database } from '../data';

export class Table extends Map implements Text {
  readonly db = Database.Main;

  toString(): string {
    return this.constructor.name;
  }
}
