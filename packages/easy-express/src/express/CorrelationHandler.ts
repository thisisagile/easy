import express from 'express';
import { ctx, HttpHeader, toUuid } from '@thisisagile/easy';

export const correlation = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  res.setHeader(HttpHeader.Correlation, (ctx.request.correlationId = req?.header(HttpHeader.Correlation) ?? toUuid()));
  next();
};
