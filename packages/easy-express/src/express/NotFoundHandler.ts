import * as Exception from '@thisisagile/easy/Exception';
import { NextFunction, Request, Response } from 'express';

import { toOriginatedError } from '@thisisagile/easy-service';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(toOriginatedError(Exception.DoesNotExist));
};
