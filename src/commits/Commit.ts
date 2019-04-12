import ICommitProtectedHeaders from './ICommitProtectedHeaders';
import ICommitUnprotectedHeaders from './ICommitUnprotectedHeaders';

/**
 * Represents a single commit
 */
export default interface Commit {

  /**
   * Gets the combined headers for this commit
   */
  getHeaders(): ICommitProtectedHeaders & ICommitUnprotectedHeaders;

  /**
   * Gets the protected headers
   */
  getProtectedHeaders(): Partial<ICommitProtectedHeaders>;

  /**
   * Gets the payload
   */
  getPayload(): any;
}
