import { NextFunction, Request, Response } from 'express';
import { Exception } from '../types';
import { toOriginatedError } from '../http';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(toOriginatedError(Exception.DoesNotExist));
};
