import type { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import type { SecretOrKeyProvider, StrategyOptionsWithRequest } from 'passport-jwt';
import type { Algorithm } from 'jsonwebtoken';
import { authError } from './AuthError';
import { ctx, Environment, HttpStatus, ifFalse } from '@thisisagile/easy';
import type { Scope, UseCase } from '@thisisagile/easy';

type EasySecretOrKeyProvider = (request: Request, rawJwtToken: any) => Promise<string | Buffer>;

export interface SecurityOptions {
  /** Configuration for verifying JWTs */
  jwtStrategyOptions?: {
    /** The secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature.
     * REQUIRED unless secretOrKeyProvider is provided. Defaults to JWT_PUBLIC_KEY from the system environment. */
    secretOrKey?: string | Buffer;

    /** Should return a secret (symmetric) or PEM-encoded public key (asymmetric) for the given key and request combination.
     * REQUIRED unless secretOrKey is provided. Note it is up to the implementer to decode rawJwtToken. */
    secretOrKeyProvider?: EasySecretOrKeyProvider;

    /** If defined, the token issuer (iss) will be verified against this value. */
    issuer?: string;

    /** If defined, the token audience (aud) will be verified against this value. */
    audience?: string;

    /** If defined, the token algorithm (alg) must be in this list. */
    algorithms?: Algorithm[];
  };
}

export const checkLabCoat = (): RequestHandler => (req, res, next) => next(ifFalse(Environment.Dev.equals(ctx.env.name), authError(HttpStatus.Forbidden)));

export const checkToken = (): RequestHandler => passport.authenticate('jwt', { session: false, failWithError: true });

export const checkScope =
  (scope: Scope): RequestHandler =>
  (req, res, next) =>
    next(ifFalse((req.user as any)?.scopes?.includes(scope.id), authError(HttpStatus.Forbidden)));

export const checkUseCase =
  (uc: UseCase): RequestHandler =>
  (req, res, next) =>
    next(ifFalse((req.user as any)?.usecases?.includes(uc.id), authError(HttpStatus.Forbidden)));

const wrapSecretOrKeyProvider = (p?: EasySecretOrKeyProvider): SecretOrKeyProvider | undefined =>
  p
    ? (request, rawJwtToken, done) =>
        p(request, rawJwtToken)
          .then(t => done(null, t))
          .catch(e => done(e))
    : undefined;

export const security = ({ jwtStrategyOptions }: SecurityOptions = {}): ((req: Request, res: Response, next: NextFunction) => void) => {
  jwtStrategyOptions ??= {};
  if ('secretOrKeyProvider' in jwtStrategyOptions)
    (jwtStrategyOptions as any).secretOrKeyProvider = wrapSecretOrKeyProvider(jwtStrategyOptions.secretOrKeyProvider);
  else if (!('secretOrKey' in jwtStrategyOptions)) jwtStrategyOptions.secretOrKey = ctx.env.get('tokenPublicKey') as string;

  const strategy = new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ...jwtStrategyOptions,
    } as StrategyOptionsWithRequest,
    (req: Request, payload: any, done: (err: any, user: any) => void) => {
      ctx.request.token = payload;
      ctx.request.jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? '';
      done(null, payload);
    }
  );

  passport.use(strategy);
  return passport.initialize();
};
