import { AppProvider, Handler } from './AppProvider';
import { Constructor, Enum, List, toList, tryTo } from '@thisisagile/easy';
import { Resource } from './Resource';

export class Service extends Enum {
  protected port = 8080;

  constructor(
    readonly name: string,
    protected app: AppProvider,
    protected resources: List<Resource> = toList()
  ) {
    super(name);
  }

  pre = (): Handler[] => [];
  post = (): Handler[] => [];

  with(...resources: Constructor<Resource>[]): this {
    return tryTo(this).accept(t => t.resources.add(resources.map(r => new r()))).value;
  }

  atPort(port: number): this {
    return tryTo(this).accept(t => (t.port = port)).value;
  }

  start(message = `Service ${this.name} listening on port ${this.port} with ${this.resources.length} resources.`): void {
    tryTo(this)
      .accept(t => t.pre().forEach(h => this.app.use(h)))
      .accept(t => t.resources.forEach(r => this.app.route(this, r)))
      .accept(t => t.post().forEach(h => this.app.use(h)))
      .accept(t => t.app.listen(this.port, message));
  }
}
