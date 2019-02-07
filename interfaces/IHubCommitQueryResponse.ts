import IHubResponse from './IHubResponse';
import IFlattenedJws from './IFlattenedJws';

/**
 * Represents a Hub's response to a `CommitQueryRequest`.
 */
export default interface IHubCommitQueryResponse extends IHubResponse<'CommitQueryResponse'> {

  /** The constant type of this response. */
  '@type': 'CommitQueryResponse';

  /** Array containing the requested commits. */
  'commits': IFlattenedJws[];

  /** The pagination token which can be used to fetch the next page of results. */
  'skip_token': string | null;

}
