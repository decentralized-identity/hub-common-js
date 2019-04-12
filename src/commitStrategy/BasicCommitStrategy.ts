import CommitStrategy from './CommitStrategy';
import IObjectMetadata from '../objects/IObjectMetadata';
import ICommit from '../commits/ICommit';
import CommitOperation from '../commits/CommitOperation';

export const BASIC_COMMIT_STRATEGY = 'basic';

/**
 * BasicCommitStrategy implements the 'basic' commit strategy
 */
export default class BasicCommitStrategy extends CommitStrategy {
  resolveObject (objectId: string, commits: ICommit[]): {
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  } {
    // reduce to only those of the right object
    const basicCommits = this.filterCommits(objectId, BASIC_COMMIT_STRATEGY, commits);
    // get the latest commit
    const latestCommit = BasicCommitStrategy.findLatestCommit(basicCommits);
    const earliestCommit = BasicCommitStrategy.findCreateCommit(objectId, basicCommits);
    if (!earliestCommit) {
      throw new Error('Cannot construct object: missing create commit');
    }
    const latestMeta = latestCommit.getHeaders();
    const staticMetadata = earliestCommit.getHeaders();
    const metadata: IObjectMetadata = {
      interface: staticMetadata.interface,
      context: staticMetadata.context,
      type: staticMetadata.type,
      id: objectId,
      created_by: staticMetadata.iss,
      created_at: staticMetadata.committed_at,
      sub: staticMetadata.sub,
      commit_strategy: BASIC_COMMIT_STRATEGY,
      meta: latestMeta.meta,
    };
    return {
      metadata,
      data: latestCommit.getPayload(),
    };
  }

  /**
   * Gets the correct create commit given the objectId
   * @param commits All commits to search through
   */
  static findCreateCommit(objectId: string, commits: ICommit[]): ICommit | undefined {
    const possibleCreates = commits.filter((commit) => {
      const commitRev = commit.getHeaders().rev;
      return commit.getProtectedHeaders().operation === CommitOperation.Create &&
        (commitRev === objectId) === (commitRev !== undefined);
    });
    return possibleCreates.length > 0 ? possibleCreates[0] : undefined;
  }

  /**
   * Gets the latest logical commit
   * @param commits All commits to search through
   */
  static findLatestCommit(commits: ICommit[]): ICommit {
    return commits.reduce((latestCommit, currentCommit) => {
      if (latestCommit) {
        if (latestCommit.getProtectedHeaders().operation === currentCommit.getProtectedHeaders().operation) {
          // the commit is of the same type and must be decided by datetime
          const latestDate = Date.parse(latestCommit.getHeaders().committed_at);
          const currentDate = Date.parse(currentCommit.getHeaders().committed_at);
          // if the commit times are the same, defer to lexigraphical rev order
          if (latestDate === currentDate &&
              latestCommit.getHeaders().rev! < currentCommit.getHeaders().rev!) {
            return currentCommit;
          }
          // latest datetime wins
          if (latestDate < currentDate) {
            return currentCommit;
          }
          return latestCommit;
        }
        // we can assume the latestCommit is NOT whatever the currentCommit is
        switch (currentCommit.getProtectedHeaders().operation) {
          case CommitOperation.Delete:
            return currentCommit;
          case CommitOperation.Update:
            if (latestCommit.getProtectedHeaders().operation !== CommitOperation.Delete) {
              return currentCommit;
            }
        }
        return latestCommit;
      }
      return currentCommit;
    });
  }

}
