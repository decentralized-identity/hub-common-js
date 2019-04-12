import CommitStrategy from './CommitStrategy';
import IObjectMetadata from '../objects/IObjectMetadata';
import ICommit from '../commits/ICommit';
import BasicCommitStrategy from './BasicCommitStrategy';

export const LAST_WRITER_WINS_COMMIT_STRATEGY = 'lastWriterWins';

/**
 * LastWriterWinsCommitStrategy implements the 'lastWriterWins' commit strategy, based off the 'basic' commit strategy
 */
export default class LastWriterWinsCommitStrategy extends CommitStrategy {
  resolveObject (objectId: string, commits: ICommit[]): {
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  } {
    // reduce to only those of the right object
    const lastWriterWins = this.filterCommits(objectId, LAST_WRITER_WINS_COMMIT_STRATEGY, commits);
    // get the latest commit
    const latestCommit = BasicCommitStrategy.findLatestCommit(lastWriterWins);
    const earliestCommit = BasicCommitStrategy.findCreateCommit(objectId, lastWriterWins);
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
      commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
      meta: latestMeta.meta,
    };
    return {
      metadata,
      data: latestCommit.getPayload(),
    };
  }
}
