import {Func} from "./Func";
import {CacheAge} from "./CacheAge";
import {Construct} from "./Constructor";

export interface Store<To = any, From = any> {
    execute: (fetch: From, f: Func<Promise<To>, From>) => Promise<To>;
}

export type CacheOptions = {
    expiresIn?: CacheAge;
    store?: Construct<Store>;
};

