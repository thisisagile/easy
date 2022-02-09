import { createNamespace } from 'cls-hooked';
import { BaseContext, RequestContext } from "@thisisagile/easy";

export class NamespaceContext extends BaseContext implements RequestContext {
  protected readonly namespace = createNamespace('context');

  public get<T>(key: string): T {
    return this.namespace.get(key) as T;
  }

  public set<T>(key: string, value: T): T {
    return this.namespace.set(key, value);
  }

  public readonly create = (f: () => void): void => this.namespace.run(f);
}
