import { NextFunction, Request, Response } from 'express';
import { Exception } from '../types';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(Exception.DoesNotExist);
};
