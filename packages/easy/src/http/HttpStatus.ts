import { Enum as EasyEnum } from '../types/Enum';
import { lazyRegistry, type Registry } from '../types/Registry';
import { TypeGuard } from '../types/TypeGuard';
import { isAn } from '../types/IsA';
import { Code } from '../types/Id';

export class Enum extends EasyEnum {
  constructor(name: string, id: Code) {
    super(name, id);
  }

  get isError(): boolean {
    return this.isClientError || this.isServerError;
  }

  get isClientError(): boolean {
    return (this.id as number) >= 400 && (this.id as number) < 500;
  }

  get isServerError(): boolean {
    return (this.id as number) >= 500 && (this.id as number) < 600;
  }

  get status(): number {
    return this.id as number;
  }
}

export const create = (name: string, id: Code): Enum => new Enum(name, id);

export const Continue = /* @__PURE__ */ new Enum('Continue', 100);
export const SwitchingProtocols = /* @__PURE__ */ new Enum('Switching protocols', 101);
export const Processing = /* @__PURE__ */ new Enum('Processing', 102);
export const EarlyHints = /* @__PURE__ */ new Enum('Early hints', 103);
export const Ok = /* @__PURE__ */ new Enum('Ok', 200);
export const Created = /* @__PURE__ */ new Enum('Created', 201);
export const Accepted = /* @__PURE__ */ new Enum('Accepted', 202);
export const NonAuthoritativeInformation = /* @__PURE__ */ new Enum('Non-authoritative information', 203);
export const NoContent = /* @__PURE__ */ new Enum('No content', 204);
export const ResetContent = /* @__PURE__ */ new Enum('Reset content', 205);
export const PartialContent = /* @__PURE__ */ new Enum('Partial content', 206);
export const MultiStatus = /* @__PURE__ */ new Enum('Multi-status', 207);
export const AlreadyReported = /* @__PURE__ */ new Enum('Already reported', 208);
export const ImUsed = /* @__PURE__ */ new Enum('IM used', 226);
export const MultipleChoices = /* @__PURE__ */ new Enum('Multiple Choices', 300);
export const MovedPermanently = /* @__PURE__ */ new Enum('Moved Permanently', 301);
export const Found = /* @__PURE__ */ new Enum('Found', 302);
export const SeeOther = /* @__PURE__ */ new Enum('See other', 303);
export const NotModified = /* @__PURE__ */ new Enum('Not modified', 304);
export const UseProxy = /* @__PURE__ */ new Enum('Use proxy', 305);
export const SwitchProxy = /* @__PURE__ */ new Enum('Switch proxy', 306);
export const TemporaryRedirect = /* @__PURE__ */ new Enum('Temporary redirect', 307);
export const PermanentRedirect = /* @__PURE__ */ new Enum('Permanent redirect', 308);
export const BadRequest = /* @__PURE__ */ new Enum('Bad request', 400);
export const NotAuthorized = /* @__PURE__ */ new Enum('Not authorized', 401);
export const PaymentRequired = /* @__PURE__ */ new Enum('Payment required', 402);
export const Forbidden = /* @__PURE__ */ new Enum('Forbidden', 403);
export const NotFound = /* @__PURE__ */ new Enum('Not found', 404);
export const MethodNotAllowed = /* @__PURE__ */ new Enum('Method not allowed', 405);
export const NotAcceptable = /* @__PURE__ */ new Enum('Not acceptable', 406);
export const ProxyAuthenticationRequired = /* @__PURE__ */ new Enum('Proxy authentication required', 407);
export const RequestTimeout = /* @__PURE__ */ new Enum('Request timeout', 408);
export const Conflict = /* @__PURE__ */ new Enum('Conflict', 409);
export const Gone = /* @__PURE__ */ new Enum('Gone', 410);
export const LengthRequired = /* @__PURE__ */ new Enum('Length required', 411);
export const PreconditionFailed = /* @__PURE__ */ new Enum('Precondition failed', 412);
export const PayloadTooLarge = /* @__PURE__ */ new Enum('Payload too large', 413);
export const UriTooLong = /* @__PURE__ */ new Enum('URI too long', 414);
export const UnsupportedMediaType = /* @__PURE__ */ new Enum('Unsupported media type', 415);
export const RangeNotSatisfiable = /* @__PURE__ */ new Enum('Range not satisfiable', 416);
export const ExpectationFailed = /* @__PURE__ */ new Enum('Expectation failed', 417);
export const ImATeapot = /* @__PURE__ */ new Enum("I'm a teapot", 418);
export const MisdirectedRequest = /* @__PURE__ */ new Enum('Misdirected request', 421);
export const UnprocessableEntity = /* @__PURE__ */ new Enum('Unprocessable entity', 422);
export const Locked = /* @__PURE__ */ new Enum('Locked', 423);
export const FailedDependency = /* @__PURE__ */ new Enum('Failed dependency', 424);
export const TooEarly = /* @__PURE__ */ new Enum('Too early', 425);
export const UpgradeRequired = /* @__PURE__ */ new Enum('Upgrade required', 426);
export const PreconditionRequired = /* @__PURE__ */ new Enum('Precondition required', 428);
export const TooManyRequests = /* @__PURE__ */ new Enum('Too many requests', 429);
export const RequestHeaderFieldsTooLarge = /* @__PURE__ */ new Enum('Request header fields too large', 431);
export const UnavailableForLegalReasons = /* @__PURE__ */ new Enum('Unavailable for legal reasons', 451);
export const InternalServerError = /* @__PURE__ */ new Enum('Internal server error', 500);
export const NotImplemented = /* @__PURE__ */ new Enum('Not implemented', 501);
export const BadGateway = /* @__PURE__ */ new Enum('Bad gateway', 502);
export const ServiceUnavailable = /* @__PURE__ */ new Enum('Service unavailable', 503);
export const GatewayTimeout = /* @__PURE__ */ new Enum('Gateway timeout', 504);
export const HTTPVersionNotSupported = /* @__PURE__ */ new Enum('Http version not supported', 505);
export const VariantAlsoNegotiates = /* @__PURE__ */ new Enum('Variant also negotiates', 506);
export const InsufficientStorage = /* @__PURE__ */ new Enum('Insufficient storage', 507);
export const LoopDetected = /* @__PURE__ */ new Enum('Loop detected', 508);
export const NotExtended = /* @__PURE__ */ new Enum('Not extended', 510);
export const NetworkAuthenticationRequired = /* @__PURE__ */ new Enum('Network authentication required', 511);

const registry = /* @__PURE__ */ lazyRegistry(() => ({
  Continue,
  SwitchingProtocols,
  Processing,
  EarlyHints,
  Ok,
  Created,
  Accepted,
  NonAuthoritativeInformation,
  NoContent,
  ResetContent,
  PartialContent,
  MultiStatus,
  AlreadyReported,
  ImUsed,
  MultipleChoices,
  MovedPermanently,
  Found,
  SeeOther,
  NotModified,
  UseProxy,
  SwitchProxy,
  TemporaryRedirect,
  PermanentRedirect,
  BadRequest,
  NotAuthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  ProxyAuthenticationRequired,
  RequestTimeout,
  Conflict,
  Gone,
  LengthRequired,
  PreconditionFailed,
  PayloadTooLarge,
  UriTooLong,
  UnsupportedMediaType,
  RangeNotSatisfiable,
  ExpectationFailed,
  ImATeapot,
  MisdirectedRequest,
  UnprocessableEntity,
  Locked,
  FailedDependency,
  TooEarly,
  UpgradeRequired,
  PreconditionRequired,
  TooManyRequests,
  RequestHeaderFieldsTooLarge,
  UnavailableForLegalReasons,
  InternalServerError,
  NotImplemented,
  BadGateway,
  ServiceUnavailable,
  GatewayTimeout,
  HTTPVersionNotSupported,
  VariantAlsoNegotiates,
  InsufficientStorage,
  LoopDetected,
  NotExtended,
  NetworkAuthenticationRequired,
}));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);

export const isHttpStatus: TypeGuard<Enum> = (s?: unknown): s is Enum => isAn<Enum>(s, 'id', 'status');
export const toHttpStatus = (s: Enum | Code): Enum => (isHttpStatus(s) ? s : byId(s));
