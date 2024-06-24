import { NextFunction, Request, Response } from 'express';
import { Exception } from '@thisisagile/easy';
import { toOriginatedError } from '@thisisagile/easy-service';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(toOriginatedError(Exception.DoesNotExist));
};
