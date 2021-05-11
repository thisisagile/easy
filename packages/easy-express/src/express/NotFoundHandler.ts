import { NextFunction, Request, Response } from 'express';
import { Exception, toOriginatedError } from '@thisisagile/easy';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(toOriginatedError(Exception.DoesNotExist));
};
