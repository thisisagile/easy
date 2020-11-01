import { isA } from "../utils/IsA";

export interface Validatable {
  isValid: boolean;
}

export const isValidatable = (v?: unknown): v is Validatable => isA<Validatable>(v, "isValid");
