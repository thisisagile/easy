import {Validatable} from "../types/Validatable";

export class Record implements Validatable {

    get isValid(): boolean { return true };

    constructor(protected state: any) {}
}
