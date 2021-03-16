import express, { RequestHandler } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { ctx } from '../types';
import { Scope, UseCase } from '../process';
import { choose } from '../utils';
import { HttpStatus } from '../http';
import { authError } from './AuthError';

export const checkToken = (): RequestHandler => passport.authenticate('jwt', { session: false, failWithError: true });

export const checkScope = (scope: Scope): RequestHandler => (req, res, next) =>
  next(
    choose(scope.id)
      .case(s => (req.user as any)?.scopes.includes(s), undefined)
      .else(authError(HttpStatus.Forbidden))
  );

export const checkUseCase = (uc: UseCase): RequestHandler => (req, res, next) =>
  next(
    choose(uc.id)
      .case(u => (req.user as any)?.usecases.includes(u), undefined)
      .else(authError(HttpStatus.Forbidden))
  );

export const security = (): ((req: express.Request, res: express.Response, next: express.NextFunction) => void) => {
  const jwtConfig: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ctx.env.get('tokenPublicKey'),
    issuer: ctx.env.get('tokenIssuer') ?? ctx.env.domain,
    audience: ctx.env.get('tokenAudience'),
    passReqToCallback: true,
  };

  const strategy = new JwtStrategy(jwtConfig, (req: express.Request, payload: any, done: (err: any, user: any) => void) => {
    ctx.request.token = payload;
    done(null, payload);
  });

  passport.use(strategy);
  return passport.initialize();
};
