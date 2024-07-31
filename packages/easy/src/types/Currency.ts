import { isA } from './IsA';

export type Currency = {
  id: string;
  name: string;
  digits: number;
  code: string;
};

export const isCurrency = (c?: unknown): c is Currency => isA<Currency>(c, 'id', 'name', 'digits', 'code');
