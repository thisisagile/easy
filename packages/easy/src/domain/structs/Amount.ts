import {Struct} from '../Struct';
import {required, valid} from '../../validation';
import {Money} from "./Money";

export class Amount extends Struct {
  @required() readonly quantity: number =  this.state.quantity;
  @required() @valid() readonly unitPrice: Money = this.state.unitPrice;

  get total(): Money {
    return this.unitPrice.times(this.quantity);
  }

  toString(): string {
    return `${this.quantity} x ${this.unitPrice.toString()}`;
  }
}

export const amount = (quantity: number, unitAmount: Money) => new Amount({ quantity, unitAmount });
