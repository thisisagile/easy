import { Constructor } from '../types';

export interface AppProvider {
  use: (h: unknown) => void;
  route: (r: Constructor) => void;
  listen: (port: number) => void
}
