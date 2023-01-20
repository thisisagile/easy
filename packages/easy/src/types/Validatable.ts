import { isA } from './IsA';
import { TypeGuard } from './TypeGuard';

export interface Validatable {
  isValid: boolean;
}

export const isValidatable: TypeGuard<Validatable> = (v?: unknown): v is Validatable => isA<Validatable>(v, 'isValid');
