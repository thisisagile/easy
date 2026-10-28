import * as App from '../../src/process/Apps';
import { registry } from '../../src';
import * as Scope from '../../src/process/Scope';
import { byScopes, create as createUseCase } from '../../src/process/UseCase';

const Dev = Scope.create('Dev');
const Tester = Scope.create('Tester', 'test');
const Manager = Scope.create('Manager', 'mngr');
const CEO = Scope.create('CEO');
const COO = Scope.create('COO');
const Managers = Scope.create('Managers', undefined, [Manager, CEO, COO]);
const People = Scope.create('People', undefined, [Dev, Tester, Managers]);

export const DevScope = { Dev, Tester, Manager, CEO, COO, Managers, People, ...registry({ Dev, Tester, Manager, CEO, COO, Managers, People }) };

const WriteCode = createUseCase(App.Main, 'Write Code', undefined, [Dev]);
const ReviewCode = createUseCase(App.Main, 'Review Code', 'Review', [Dev]);
const WriteUnitTest = createUseCase(App.Main, 'Write Unit Test', undefined, [Dev, Tester]);
const BuildCode = createUseCase(App.Main, 'Build Code', undefined, [Dev, Tester]);
const ReleaseCode = createUseCase(App.Main, 'Release Code', undefined, [Dev, Tester]);
const CreateSpreadSheet = createUseCase(App.Main, 'Create Spread Sheet', undefined, [Managers]);
const useCases = { WriteCode, ReviewCode, WriteUnitTest, BuildCode, ReleaseCode, CreateSpreadSheet };

export const DevUseCase = {
  ...useCases,
  ...registry(useCases),
  byScopes: (...scopes: Scope.Enum[]) => byScopes(Object.values(useCases), ...scopes),
};
