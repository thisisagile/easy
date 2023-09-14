import { Response } from '../utils/Response';
import { match } from './Match';

export const toHaveStatus = (res: Response, code: number): jest.CustomMatcherResult =>
  match<Response>(res)
    .undefined(r => r, 'Response is unknown.')
    .undefined(
      r => r?.status?.id,
      () => 'Response does not have a status code'
    )
    .not(
      r => r.status.id === code,
      r => `Response does not have code '${code}', but has code '${r.status.id}' instead.`
    )
    .else(`Response does have status code '${code}'.`);

export const toBeOk = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 200);

export const toBeCreated = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 201);

export const toHaveNoContent = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 204);

export const toBeBadRequest = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 400);

export const toBeUnauthorized = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 401);

export const toBeForbidden = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 403);

export const toBeNotFound = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 404);

export const toBeConflict = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 409);

export const toBeInternalServerError = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 500);

export const toBeBadGateway = (res: Response): jest.CustomMatcherResult => toHaveStatus(res, 502);

export const toBeOkWithItems = (res: Response, length: number): jest.CustomMatcherResult =>
  match<Response>(res)
    .undefined(r => r.status?.id, 'Response did not have a status')
    .not(
      r => r.status.id === 200,
      r => `Response did not have status '200'. It had status '${r.status.id}' instead.`
    )
    .undefined(r => r?.body?.data?.items, `Response did not have any items.`)
    .not(
      r => (r?.body?.data?.itemCount ?? 0) >= length,
      r => `Response did not have at least ${length} items. It only had ${r?.body?.data?.itemCount ?? 0} items.`
    )
    .else(`Response had status 200 and at least ${length} items`);

expect.extend({
  toBeOk,
  toBeOkWithItems,
  toBeCreated,
  toHaveNoContent,
  toBeNotFound,
  toBeBadRequest,
  toBeUnauthorized,
  toBeForbidden,
  toBeConflict,
  toBeInternalServerError,
  toHaveStatus,
  toBeBadGateway,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeOk(): R;
      toBeOkWithItems(length: number): R;
      toBeCreated(): R;
      toHaveNoContent(): R;
      toBeNotFound(): R;
      toBeUnauthorized(): R;
      toBeForbidden(): R;
      toBeBadRequest(): R;
      toBeConflict(): R;
      toBeInternalServerError(): R;
      toBeBadGateway(): R;
      toHaveStatus(code: number): R;
    }
  }
}
