import ICommitStrategy from './ICommitStrategy';
import IObjectMetadata from '../objects/IObjectMetadata';

export const LAST_WRITER_WINS_COMMIT_STRATEGY = 'lastWriterWins';

/**
 * LastWriterWinsCommitStrategy implements the 'lastWriterWins' commit strategy
 */
export default class LastWriterWinsCommitStrategy implements ICommitStrategy {
  resolveObject (objectId: string, commits: any[]): Promise<{
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  }> {
    throw new Error(`Method not implemented. ${objectId}, ${commits.length}`);
  }

}
