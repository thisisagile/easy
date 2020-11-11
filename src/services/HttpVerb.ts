import {Enum} from '../types';

export class HttpVerb extends Enum {
    static Get = new HttpVerb("Get", "GET");
    static Put = new HttpVerb("Put", "PUT");
    static Patch = new HttpVerb("Patch", "PATCH");
    static Post = new HttpVerb("Post", "POST");
    static Delete = new HttpVerb("Delete", "DELETE");
}
