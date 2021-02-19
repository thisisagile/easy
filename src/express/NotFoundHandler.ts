import { NextFunction, Request, Response } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new Error('Does not exist'));
};
