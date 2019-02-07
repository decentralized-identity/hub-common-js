/**
 * Represents the possible unprotected (convenience) headers of an Identity Hub commit.
 */
export default interface ICommitUnprotectedHeaders {

  /** The revision hash (primary identifier) of this commit. */
  rev?: string;

}
