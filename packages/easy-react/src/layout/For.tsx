import React, { FunctionComponent } from 'react';
import { If } from './If';

export interface ForProps<T = any> {
  items: T[];
  transform?: (item: T, i: number) => Node;
}

export const For: FunctionComponent<ForProps> = ({ items, transform }: ForProps) => (
  <If condition={items}>{items?.map((item: any, i: number) => (transform ? transform(item, i) : item))}</If>
);
