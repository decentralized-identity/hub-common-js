/**
 * Optional filters used when querying the objects in an Identity Hub.
 */
export default interface IHubObjectQueryOptions {

  /** Queries objects with the specified interface (e.g. `Collections` or `Actions`). */
  interface?: string;

  /** Queries objects with the specified context (e.g. `schema.org`). */
  context?: string;

  /** Queries objects with the specified type (e.g. `MusicPlaylist`). */
  type?: string;

  /** Queries objects with the specified object ID. This filter is exclusive of all others. */
  object_id?: string[];

  /** Used to retrieve the next page of results for a previously-issued query. */
  skip_token?: string;

}
