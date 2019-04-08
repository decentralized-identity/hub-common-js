import ICommitProtectedHeaders from './ICommitProtectedHeaders';
import ICommitUnprotectedHeaders from './ICommitUnprotectedHeaders';

export default abstract class Commit {

  /**
   * Gets the combined headers for this commit
   */
  abstract getHeaders(): ICommitProtectedHeaders & ICommitUnprotectedHeaders;

  /**
   * Gets the protected headers
   */
  abstract getProtectedHeaders(): Partial<ICommitProtectedHeaders>;

  /**
   * Gets the payload
   */
  abstract getPayload(): any;
}
