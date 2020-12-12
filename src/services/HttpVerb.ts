import {Enum} from '../types';

export class HttpVerb extends Enum {
    static Get = new HttpVerb("Get", "GET", "get");
    static Put = new HttpVerb("Put", "PUT", "put");
    static Patch = new HttpVerb("Patch", "PATCH", "patch");
    static Post = new HttpVerb("Post", "POST", "post");
    static Delete = new HttpVerb("Delete", "DELETE", "delete");
}
