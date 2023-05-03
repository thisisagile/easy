import { Code, Enum, isAn, TypeGuard } from '../types';

export class HttpStatus extends Enum {
  static Continue = new HttpStatus('Continue', 100);
  static SwitchingProtocols = new HttpStatus('Switching protocols', 101);
  static Processing = new HttpStatus('Processing', 102);
  static EarlyHints = new HttpStatus('Early hints', 103);
  static Ok = new HttpStatus('Ok', 200);
  static Created = new HttpStatus('Created', 201);
  static Accepted = new HttpStatus('Accepted', 202);
  static NonAuthoritativeInformation = new HttpStatus('Non-authoritative information', 203);
  static NoContent = new HttpStatus('No content', 204);
  static ResetContent = new HttpStatus('Reset content', 205);
  static PartialContent = new HttpStatus('Partial content', 206);
  static MultiStatus = new HttpStatus('Multi-status', 207);
  static AlreadyReported = new HttpStatus('Already reported', 208);
  static ImUsed = new HttpStatus('IM used', 226);
  static MultipleChoices = new HttpStatus('Multiple Choices', 300);
  static MovedPermanently = new HttpStatus('Moved Permanently', 301);
  static Found = new HttpStatus('Found', 302);
  static SeeOther = new HttpStatus('See other', 303);
  static NotModified = new HttpStatus('Not modified', 304);
  static UseProxy = new HttpStatus('Use proxy', 305);
  static SwitchProxy = new HttpStatus('Switch proxy', 306);
  static TemporaryRedirect = new HttpStatus('Temporary redirect', 307);
  static PermanentRedirect = new HttpStatus('Permanent redirect', 308);
  static BadRequest = new HttpStatus('Bad request', 400);
  static NotAuthorized = new HttpStatus('Not authorized', 401);
  static PaymentRequired = new HttpStatus('Payment required', 402);
  static Forbidden = new HttpStatus('Forbidden', 403);
  static NotFound = new HttpStatus('Not found', 404);
  static MethodNotAllowed = new HttpStatus('Method not allowed', 405);
  static NotAcceptable = new HttpStatus('Not acceptable', 406);
  static ProxyAuthenticationRequired = new HttpStatus('Proxy authentication required', 407);
  static RequestTimeout = new HttpStatus('Request timeout', 408);
  static Conflict = new HttpStatus('Conflict', 409);
  static Gone = new HttpStatus('Gone', 410);
  static LengthRequired = new HttpStatus('Length required', 411);
  static PreconditionFailed = new HttpStatus('Precondition failed', 412);
  static PayloadTooLarge = new HttpStatus('Payload too large', 413);
  static UriTooLong = new HttpStatus('URI too long', 414);
  static UnsupportedMediaType = new HttpStatus('Unsupported media type', 415);
  static RangeNotSatisfiable = new HttpStatus('Range not satisfiable', 416);
  static ExpectationFailed = new HttpStatus('Expectation failed', 417);
  static ImATeapot = new HttpStatus("I'm a teapot", 418);
  static MisdirectedRequest = new HttpStatus('Misdirected request', 421);
  static UnprocessableEntity = new HttpStatus('Unprocessable entity', 422);
  static Locked = new HttpStatus('Locked', 423);
  static FailedDependency = new HttpStatus('Failed dependency', 424);
  static TooEarly = new HttpStatus('Too early', 425);
  static UpgradeRequired = new HttpStatus('Upgrade required', 426);
  static PreconditionRequired = new HttpStatus('Precondition required', 428);
  static TooManyRequests = new HttpStatus('Too many requests', 429);
  static RequestHeaderFieldsTooLarge = new HttpStatus('Request header fields too large', 431);
  static UnavailableForLegalReasons = new HttpStatus('Unavailable for legal reasons', 451);
  static InternalServerError = new HttpStatus('Internal server error', 500);
  static NotImplemented = new HttpStatus('Not implemented', 501);
  static BadGateway = new HttpStatus('Bad gateway', 502);
  static ServiceUnavailable = new HttpStatus('Service unavailable', 503);
  static GatewayTimeout = new HttpStatus('Gateway timeout', 504);
  static HTTPVersionNotSupported = new HttpStatus('Http version not supported', 505);
  static VariantAlsoNegotiates = new HttpStatus('Variant also negotiates', 506);
  static InsufficientStorage = new HttpStatus('Insufficient storage', 507);
  static LoopDetected = new HttpStatus('Loop detected', 508);
  static NotExtended = new HttpStatus('Not extended', 510);
  static NetworkAuthenticationRequired = new HttpStatus('Network authentication required', 511);

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

export const isHttpStatus: TypeGuard<HttpStatus> = (s?: unknown): s is HttpStatus => isAn<HttpStatus>(s, 'id', 'status');

export const toHttpStatus = (s: HttpStatus | Code): HttpStatus => (isHttpStatus(s) ? s : HttpStatus.byId(s));
