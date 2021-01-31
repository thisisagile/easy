import express from 'express';
import { ctx, toUuid } from '../types';

export const correlationHeader = 'X-Correlation-Id';

export const correlation = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  ctx.request.correlationId = req?.header(correlationHeader) ?? toUuid();
  res.setHeader(correlationHeader, ctx.request.correlationId);
  next();
};
