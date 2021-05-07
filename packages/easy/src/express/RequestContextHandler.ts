import express from 'express';
import { ctx } from '../types';

export const requestContext = (req: express.Request, res: express.Response, next: express.NextFunction): void => ctx.request.create(() => next());
