/**
 * Options which can be used when querying a Hub for commits.
 */
export default interface IHubCommitQueryOptions {

  /** Used to request the constituent commits for one or more specific object IDs. */
  object_id?: string[];

  /** Used to request one or more specific commits based on their revision hash. */
  revision?: string[];

  /** Used to retrieve the next page of results for a previously-issued query. */
  skip_token?: string;

}
