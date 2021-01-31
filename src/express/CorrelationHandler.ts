import express from 'express';
import { ctx, toUuid } from '../types';

export const correlationHeader = 'X-Correlation-Id';

export const correlation = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  res.setHeader(correlationHeader, ctx.request.correlationId = req?.header(correlationHeader) ?? toUuid());
  next();
};
