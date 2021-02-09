import { Uri } from "../types";
import { HttpVerb } from "./HttpVerb";
import { RequestOptions } from "./RequestOptions";
import { RestResult, toRestResult } from "./RestResult";
import { HttpStatus } from "./HttpStatus";

export type Request = {
  uri: Uri;
  verb: HttpVerb;
  body?: unknown;
  transform?: (r: any) => any;
  options?: RequestOptions;
};

export type Response = {
  status: HttpStatus,
  headers?: { [key: string]: any },
  body: RestResult
}

export const toResponse = (status: number, headers?: { [key: string]: any }, body?: unknown): Response => ({
  status: HttpStatus.byId(status),
  headers,
  body: toRestResult(body)
});

export interface RequestProvider {
  execute: (request: Request) => Promise<Response>;
}
