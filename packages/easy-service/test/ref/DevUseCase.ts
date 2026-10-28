import { create as createScope } from '@thisisagile/easy/Scope';
import { create as createUseCase } from '@thisisagile/easy/UseCase';
import * as App from '@thisisagile/easy/App';

export const DevScope = {
  Dev: createScope('Dev'),
};

export const DevUseCase = {
  WriteCode: createUseCase(App.Main, 'Write Code', undefined, [DevScope.Dev]),
};
