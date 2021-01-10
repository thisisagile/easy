import {Map} from "../utils";
import { Text } from '../types';

export class Table extends Map implements Text {
  toString(): string {
    return this.constructor.name;
  }
}
