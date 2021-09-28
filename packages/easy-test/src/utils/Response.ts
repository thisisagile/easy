import { Id } from './Types';

export type HttpStatus = { name: string; id: Id };

export type RestResult = {
  data?: { code: number; items: unknown[]; itemCount: number };
  error?: { code: number; message: string; errorCount: number; errors: unknown[] };
};

export type Response = { status: HttpStatus; headers?: { [key: string]: any }; body?: RestResult };
