/**
 * List of error codes potentially returned by an Identity Hub.
 */
enum HubErrorCode {

  /** Indicates that the attempted authentication method was invalid or expired. */
  AuthenticationFailed = 'authentication_failed',

  /** Indicates that the request issued by the client was invalid. */
  BadRequest = 'bad_request',

  /** Indicates that the requested entity was not found. */
  NotFound = 'not_found',

  /** Indicates that the requested interface/method is not yet implemented. */
  NotImplemented = 'not_implemented',

  /** Indicates that the client lacks necessary permissions to complete the request. */
  PermissionsRequired = 'permissions_required',

  /** Indicates that the Hub service is temporarialy unavailable. */
  TemporarilyUnavailable = 'temporarily_unavailable',

  /** Indicates that the client has made too many requests recently and should back off attempts. */
  TooManyRequests = 'too_many_requests',

  /** Indicates that an internal error occurred inside the Hub. */
  ServerError = 'server_error',

  /** Indicates that the Hub service is temporarialy unavailable. */
  ServiceUnavailable = 'service_unavailable',

}

export default HubErrorCode;
