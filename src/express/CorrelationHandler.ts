import express from 'express';
import { ctx, toUuid } from '../types';
import { HttpHeader } from '../http';

export const correlation = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  res.setHeader(HttpHeader.Correlation, (ctx.request.correlationId = req?.header(HttpHeader.Correlation) ?? toUuid()));
  next();
};
