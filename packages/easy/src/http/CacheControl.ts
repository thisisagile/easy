import {cacheAge, CacheAge, isNumber, meta, on} from '../types';
import {ifDefined} from "../utils";

export class CacheControl {
    name = 'Cache-Control';

    protected constructor(readonly enabled = true, private directives: Record<string, boolean | CacheAge | undefined> = {}) {
    }

    static disabled = () => new CacheControl(false);

    static OneSecond = () => new CacheControl().maxAge(1).staleWhileRevalidate(1);

    static fiveSeconds = () => new CacheControl().maxAge(5).staleWhileRevalidate(5);

    static tenSeconds = () => new CacheControl().maxAge(10).staleWhileRevalidate(10);

    static thirtySeconds = () => new CacheControl().maxAge(30).staleWhileRevalidate(30);

    static sixtySeconds = () => new CacheControl().maxAge(60).staleWhileRevalidate(60);

    static custom = (maxAge?: CacheAge, staleWhileRevalidate?: CacheAge) => new CacheControl().maxAge(maxAge).staleWhileRevalidate(staleWhileRevalidate);

    readonly maxAge = (ca?: CacheAge): this => on(this, t => t.directives['max-age'] = ca);

    readonly sharedMaxAge = (ca?: CacheAge): this => on(this, t => t.directives['s-maxage'] = ca);

    readonly noCache = (a?: boolean): this => on(this, t => t.directives['no-cache'] = a);

    readonly mustRevalidate = (a?: boolean): this => on(this, t => t.directives['must-revalidate'] = a);

    readonly private = (a?: boolean): this => on(this, t => t.directives['private'] = a);

    readonly public = (a?: boolean): this => on(this, t => t.directives['public'] = a);

    readonly immutable = (a?: boolean): this => on(this, t => t.directives['immutable'] = a);

    readonly staleWhileRevalidate = (ca?: CacheAge): this => on(this, t => t.directives['stale-while-revalidate'] = ca);

    value = (): string => this.toString();

    toString(): string {
        return meta(this.directives).entries().mapDefined(([k, v]) => ifDefined(v, isNumber(v) ? `${k}=${cacheAge.toSeconds(v)}` : k)).join(',');
    }
}
