import {Code, Id} from "./Id";

export class Enum {
    constructor(readonly name: string, readonly id: Id = name.toLowerCase(), readonly code: Code = id) {}
}
