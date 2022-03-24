import express, { Request, RequestHandler } from 'express';
import passport from 'passport';
import passportJwt, { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { authError } from './AuthError';
import { choose, ctx, Environment, HttpStatus, Scope, UseCase } from '@thisisagile/easy';

type SecretOrKeyProvider = (request: Request, rawJwtToken: any) => Promise<string | Buffer>;

export interface SecurityOptions {
  /** Configuration for verifying JWTs */
  jwtStrategyOptions?: {
    /** The secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature.
     * REQUIRED unless secretOrKeyProvider is provided. Defaults to JWT_PUBLIC_KEY from the system environment. */
    secretOrKey?: string | Buffer;

    /** Should return a secret (symmetric) or PEM-encoded public key (asymmetric) for the given key and request combination.
     * REQUIRED unless secretOrKey is provided. Note it is up to the implementer to decode rawJwtToken. */
    secretOrKeyProvider?: SecretOrKeyProvider;

    /** If defined, the token issuer (iss) will be verified against this value. */
    issuer?: string;

    /** If defined, the token audience (aud) will be verified against this value. */
    audience?: string;

    /** If defined, the token algorithm (alg) must be in this list. */
    algorithms?: string[];
  };
}

export const checkLabCoat = (): RequestHandler => (req, res, next) =>
  next(
    choose(ctx.env.name)
      .case(e => Environment.Dev.equals(e), undefined)
      .else(authError(HttpStatus.Forbidden)),
  );

export const checkToken = (): RequestHandler => passport.authenticate('jwt', { session: false, failWithError: true });

export const checkScope =
  (scope: Scope): RequestHandler =>
    (req, res, next) =>
      next(
        choose(scope.id)
          .case(s => (req.user as any)?.scopes.includes(s), undefined)
          .else(authError(HttpStatus.Forbidden)),
      );

export const checkUseCase =
  (uc: UseCase): RequestHandler =>
    (req, res, next) =>
      next(
        choose(uc.id)
          .case(u => (req.user as any)?.usecases.includes(u), undefined)
          .else(authError(HttpStatus.Forbidden)),
      );

const wrapSecretOrKeyProvider = (p?: SecretOrKeyProvider): passportJwt.SecretOrKeyProvider | undefined =>
  p
    ? (request, rawJwtToken, done) =>
      p(request, rawJwtToken)
        .then(t => done(null, t))
        .catch(e => done(e))
    : undefined;

export const security = ({ jwtStrategyOptions }: SecurityOptions = {}): ((req: express.Request, res: express.Response, next: express.NextFunction) => void) => {
  const jwtConfig: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtStrategyOptions?.secretOrKey ?? (jwtStrategyOptions?.secretOrKeyProvider ? undefined : ctx.env.get('tokenPublicKey')),
    secretOrKeyProvider: wrapSecretOrKeyProvider(jwtStrategyOptions?.secretOrKeyProvider),
    issuer: jwtStrategyOptions?.issuer,
    audience: jwtStrategyOptions?.audience,
    algorithms: jwtStrategyOptions?.algorithms,
    passReqToCallback: true,
  };

  const strategy = new JwtStrategy(jwtConfig, (req: express.Request, payload: any, done: (err: any, user: any) => void) => {
    ctx.request.token = payload;
    ctx.request.jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? '';
    done(null, payload);
  });

  passport.use(strategy);
  return passport.initialize();
};
