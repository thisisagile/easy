import {is} from "../utils/Is";

export interface Validatable {
    isValid: boolean;
}

export const isValidatable = (v?: unknown): v is Validatable => is(v).defined && is((v as Validatable).isValid).defined;
