import {Validatable} from "../types";

export abstract class Record implements Validatable {

    get isValid(): boolean { return true }

    constructor(protected state: any) {}
}
