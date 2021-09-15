import { createNamespace } from 'cls-hooked';
import { Identity, RequestContext, Uuid } from '@thisisagile/easy';

export class NamespaceContext implements RequestContext {
  private readonly namespace = createNamespace('context');

  get token(): unknown {
    return this.namespace.get('token');
  }

  set token(token: unknown) {
    this.namespace.set('token', token);
  }

  get identity(): Identity {
    return this.token as Identity;
  }

  get jwt(): string {
    return this.namespace.get('jwt');
  }

  set jwt(jwt: string) {
    this.namespace.set('jwt', jwt);
  }

  get correlationId(): Uuid {
    return this.namespace.get('correlationId');
  }

  set correlationId(id: Uuid) {
    this.namespace.set('correlationId', id);
  }

  get lastError(): string | undefined {
    return this.namespace.get('lastError');
  }

  set lastError(error: string | undefined) {
    this.namespace.set('lastError', error);
  }

  public get(key: string): any {
    return this.namespace.get(key);
  }

  public set<T>(key: string, value: T): T {
    return this.namespace.set(key, value);
  }

  public readonly create = (f: () => void): void => this.namespace.run(f);
}
