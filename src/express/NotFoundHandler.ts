import { Request, Response } from 'express';
import { HttpStatus, toRestResult } from '../services';

export const notFound = (req: Request, res: Response): void => {
  res.status(HttpStatus.NotFound.status).json(toRestResult(HttpStatus.NotFound));
};
