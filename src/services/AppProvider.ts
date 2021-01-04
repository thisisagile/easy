import { Resource } from './Resource';

export type Handler = () => void;

export interface AppProvider {
  use: (h: Handler) => void;
  route: (r: Resource) => void;
  listen: (port: number, message?: string) => void;
}
