import express, { RequestHandler } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { ctx } from '../types';
import { Scope, UseCase } from '../process';
import { choose } from '../utils';
import { HttpStatus } from '../services';

export const authenticationError = ({ name, status }: HttpStatus): Error & { status: number } => ({
  ...Error(),
  name: 'AuthenticationError',
  message: name,
  status,
});

export function checkScope(scope: Scope): RequestHandler {
  return (req, res, next) => {
    next(
      choose(scope.code)
        .case(s => (req.user as any)?.scopes.includes(s), undefined)
        .else(authenticationError(HttpStatus.Forbidden))
    );
  };
}

export function checkUseCase(uc: UseCase): RequestHandler {
  return (req, res, next) => {
    next(
      choose(uc.code)
        .case(s => (req.user as any)?.usecases.includes(s), undefined)
        .else(authenticationError(HttpStatus.Forbidden))
    );
  };
}

export const security = (): ((req: express.Request, res: express.Response, next: express.NextFunction) => void) => {
  const jwtConfig: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ctx.env.get('tokenSecretOrKey'),
    issuer: ctx.env.get('tokenIssuer', ctx.env.domain),
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
