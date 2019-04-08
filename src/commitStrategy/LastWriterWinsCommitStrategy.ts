import ICommitStrategy from './ICommitStrategy';
import IObjectMetadata from '../objects/IObjectMetadata';
import Commit from '../commits/Commit';
import { BasicCommitStrategy } from '../index';

export const LAST_WRITER_WINS_COMMIT_STRATEGY = 'lastWriterWins';

/**
 * LastWriterWinsCommitStrategy implements the 'lastWriterWins' commit strategy, based off the 'basic' commit strategy
 */
export default class LastWriterWinsCommitStrategy implements ICommitStrategy {
  resolveObject (objectId: string, commits: Commit[]): {
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  } {
    // reduce to only those of the right object
    const lastWriterWins = commits.filter((commit) => {
      return commit.getProtectedHeaders().commit_strategy === LAST_WRITER_WINS_COMMIT_STRATEGY &&
        commit.getProtectedHeaders().object_id! === objectId;
    });
    // get the latest commit
    const earliestCommit = BasicCommitStrategy.findEarliestCommit(lastWriterWins);
    const latestCommit = BasicCommitStrategy.findLatestCommit(lastWriterWins);
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
      commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
      meta: latestMeta.meta,
    };
    return {
      metadata,
      data: latestCommit.getPayload()
    };
  }
}
