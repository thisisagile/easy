import { Constructor } from '../types';

export interface AppProvider {
  use: (h: any) => void;
  route: (r: Constructor) => void;
  listen: (port: number) => void
}
