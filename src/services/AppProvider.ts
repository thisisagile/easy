import { Resource } from './Resource';

export interface AppProvider {
  use: (h: any) => void;
  route: (r: Resource) => void;
  listen: (port: number, message?: string) => void;
}
