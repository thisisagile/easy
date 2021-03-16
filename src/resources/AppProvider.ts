import { Resource } from './Resource';
import { Service } from './Service';

export type Handler = (...params: any[]) => void;

export interface AppProvider {
  use: (h: Handler) => void;
  route: (s: Service, r: Resource) => void;
  listen: (port: number, message?: string) => void;
}
