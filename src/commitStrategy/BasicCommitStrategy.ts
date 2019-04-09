import ICommitStrategy from './ICommitStrategy';
import { IObjectMetadata } from '../index';
import Commit from '../commits/Commit';
import CommitOperation from '../commits/CommitOperation';

export const BASIC_COMMIT_STRATEGY = 'basic';

/**
 * BasicCommitStrategy implements the 'basic' commit strategy
 */
export default class BasicCommitStrategy implements ICommitStrategy {
  resolveObject (objectId: string, commits: Commit[]): {
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  } {
    // reduce to only those of the right object
    const basicCommits = commits.filter((commit) => {
      return commit.getProtectedHeaders().commit_strategy === BASIC_COMMIT_STRATEGY;
    });
    // get the latest commit
    const earliestCommit = BasicCommitStrategy.findEarliestCommit(basicCommits);
    const latestCommit = BasicCommitStrategy.findLatestCommit(basicCommits);
    const earliestMeta = earliestCommit.getHeaders();
    const latestMeta = latestCommit.getHeaders();
    const metadata: IObjectMetadata = {
      interface: earliestMeta.interface,
      context: earliestMeta.context,
      type: earliestMeta.type,
      id: objectId,
      created_by: earliestMeta.iss,
      created_at: earliestMeta.committed_at,
      sub: earliestMeta.sub,
      commit_strategy: BASIC_COMMIT_STRATEGY,
      meta: latestMeta.meta,
    };
    return {
      metadata,
      data: latestCommit.getPayload(),
    };
  }

  /**
   * Gets the earliest logical commit
   * @param commits All commits to search through
   */
  static findEarliestCommit(commits: Commit[]): Commit {
    return commits.reduce((earliestCommit, currentCommit) => {
      if (earliestCommit) {
        if (earliestCommit.getProtectedHeaders().operation === currentCommit.getProtectedHeaders().operation) {
          // the commit is of the same type and must be decided by datetime
          const earliestDate = Date.parse(earliestCommit.getHeaders().committed_at);
          const currentDate = Date.parse(currentCommit.getHeaders().committed_at);
          // if the commit times are the same, defer to lexigraphical rev order
          if (earliestDate === currentDate &&
            earliestCommit.getHeaders().rev! > currentCommit.getHeaders().rev!) {
            return currentCommit;
          }
          // sort by datetime
          if (earliestDate > currentDate) {
            return currentCommit;
          }
          return earliestCommit;
        }
        // we can assume the earliestCommit is NOT whatever the currentCommit is
        switch (currentCommit.getProtectedHeaders().operation) {
          case CommitOperation.Create:
            return currentCommit;
          case CommitOperation.Update:
            if (earliestCommit.getProtectedHeaders().operation !== CommitOperation.Create) {
              return currentCommit;
            }
        }
        return earliestCommit;
      }
      return currentCommit;
    });
  }

  /**
   * Gets the latest logical commit
   * @param commits All commits to search through
   */
  static findLatestCommit(commits: Commit[]): Commit {
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
