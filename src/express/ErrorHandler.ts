import { isResults, Results } from '../types';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus, toRestResult } from '../services';

export const error = (e: string | Error | Results, req: Request, res: Response, _next: NextFunction): void => {
  res.set('Connection', 'close');
  res.status(isResults(e) ? HttpStatus.BadRequest.status : HttpStatus.InternalServerError.status).json(toRestResult(e));
};
