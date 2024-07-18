import { Resource } from './Resource';
import { Service } from './Service';
import { Func } from '../types/Func';

export type Handler = Func<void, any>;

export interface AppProvider {
  use: (h: Handler) => void;
  route: (s: Service, r: Resource) => void;
  listen: (port: number, message?: string) => void;
}
