import { asString, Text } from './Text';
import { Enum as EasyEnum } from './Enum';
import { lazyRegistry } from './Registry';
import { isDefined } from './Is';
import { Id } from './Id';

import { text } from './ToText';

export class Enum extends EasyEnum {
  constructor(
    readonly message: string,
    id?: Id,
    readonly reason?: Text
  ) {
    super(message, id ?? text(message).pascal.toString());
  }

  because = (reason: Text): Enum => new Enum(this.message, this.id, reason);
}

export const create = (message: string, id?: Id, reason?: Text): Enum => new Enum(message, id, reason);

export const AlreadyExists = /* @__PURE__ */ create('Subject already exists');
export const DoesNotExist = /* @__PURE__ */ create('Does not exist');
export const IsMissingId = /* @__PURE__ */ create('Subject is missing an id');
export const IsNotImplemented = /* @__PURE__ */ create('Is not implemented');
export const IsNotValid = /* @__PURE__ */ create('Is not valid');
export const Unknown = /* @__PURE__ */ create('Unknown error');

export const CouldNotExecute = (target: Text): Enum => create(`Could not execute ${target}.`, 'CouldNotExecute');
export const CouldNotValidate = (target: Text): Enum => create(`Could not validate ${target}.`, 'CouldNotValidate');
export const EnvironmentVariableNotFound = (variable: Text): Enum =>
  create(`Environment variable ${text(variable).upper} could not be found.`, 'EnvironmentVariableNotFound');

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({
  AlreadyExists,
  DoesNotExist,
  IsMissingId,
  IsNotImplemented,
  IsNotValid,
  Unknown,
}));

export const isException = (e?: unknown, t?: Text): e is Enum => e instanceof Enum && (isDefined(t) ? e.equals(asString(t)) : true);
export const isDoesNotExist = (e?: unknown): e is Enum => e instanceof Enum && DoesNotExist.equals(e);
