import { Json, jsonify, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Record implements Validatable {
    constructor(protected readonly state: any = {}) {}

    get isValid(): boolean { return validate(this).isValid; }

    toJSON(): Json {
        return jsonify({ ...this, state: undefined });
    }
}
