import {Validatable} from "../types";
import { validate } from '../validation';

export abstract class Record implements Validatable {

    get isValid(): boolean { return validate(this).isValid; }

    constructor(protected state: any) {}
}
