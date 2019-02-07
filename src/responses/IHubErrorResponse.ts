import IHubResponse from './IHubResponse';
import IHubError from './IHubError';

/**
 * Represents a Hub's response to an `ObjectQueryRequest`.
 */
export default interface IHubErrorResponse extends IHubResponse<'ErrorResponse'>, IHubError {

  /** The constant type of this response. */
  '@type': 'ErrorResponse';

}
