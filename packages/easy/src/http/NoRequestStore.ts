import {Func, Store} from "../types";
import {Request} from "./Request";
import {Response} from "./Response";

export class NoRequestStore implements Store<Response, Request> {
    execute(req: Request, f: Func<Promise<Response>, Request>): Promise<Response> {
        return f(req);
    }
}
