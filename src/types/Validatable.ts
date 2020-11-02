import { isA } from "./IsA";

export interface Validatable {
  isValid: boolean;
}

export const isValidatable = (v?: unknown): v is Validatable => isA<Validatable>(v, "isValid");
