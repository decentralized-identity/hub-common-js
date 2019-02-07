import IHubResponse from './IHubResponse';

/**
 * Represents a Hub's response to an `WriteRequest`.
 */
export default interface IHubWriteResponse extends IHubResponse<'WriteResponse'> {

  /** The constant type of this response. */
  '@type': 'WriteResponse';

  /** The list of known revisions for the object which was created/modified. */
  'revisions': string[];

}
