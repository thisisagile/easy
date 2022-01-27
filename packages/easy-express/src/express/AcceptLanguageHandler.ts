import express from 'express';
import { ctx } from '@thisisagile/easy';

export const languageSelector: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const al = req.acceptsLanguages('nl', 'en', 'pl', 'de');
  ctx.request.set('language', al === false ? 'nl' : al);
  next();
};
