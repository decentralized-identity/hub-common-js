import Commit from './Commit';
import ICommitUnprotectedHeaders from './ICommitUnprotectedHeaders';
import ICommitProtectedHeaders from './ICommitProtectedHeaders';
import CommitOperation from './CommitOperation';

/**
 * Simple Commit implementation to be used in unit tests
 */
export default class TestCommit implements Commit {

  /** unprotected headers */
  private unprotected: ICommitUnprotectedHeaders;

  /** protected headers */
  private protected: ICommitProtectedHeaders;

  /** payload */
  private payload: any;

  /**
   * Constructs a new test commit. Will contruct values if not passed
   * @param options Optional values to set in the commit
   */
  constructor(options?: {
    /** Unprotected header values */
    unprotected?: ICommitUnprotectedHeaders,
    /** Protected header values */
    protected?: Partial<ICommitProtectedHeaders>,
    /** Payload of the commit */
    payload?: any,
  }) {
    if (options && options.unprotected) {
      this.unprotected = options.unprotected;
    } else {
      this.unprotected = {
        rev: this.getHash('revision'),
      };
    }
    this.protected = {
      interface: 'Test',
      context: 'example.com/',
      type: this.getHash('type'),
      operation: [CommitOperation.Create, CommitOperation.Update, CommitOperation.Delete][Math.floor(Math.random() * 3)],
      committed_at: new Date().toISOString(),
      commit_strategy: 'test',
      sub: 'did:test:owner.id',
      kid: 'did:test:issuer.id#key-1',
      iss: 'did:test:issuer.id',
      object_id: this.getHash('object'),
    };
    if (options && options.protected) {
      this.protected = Object.assign(this.protected, options.protected);
    }
    if (options && options.payload) {
      this.payload = options.payload;
    } else {
      this.payload = {
        test: this.getHash('test value: '),
      };
    }
  }

  /**
   * Generates a random string
   * @param prefix prefix to add to the string
   */
  private getHash(prefix?: string): string {
    return (prefix || '') + Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(32);
  }

  getHeaders(): ICommitProtectedHeaders & ICommitUnprotectedHeaders {
    return Object.assign({}, this.unprotected, this.protected);
  }
  getProtectedHeaders(): Partial<ICommitProtectedHeaders> {
    return this.protected;
  }
  getPayload(): any {
    return this.payload;
  }
}
