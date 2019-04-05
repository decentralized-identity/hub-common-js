import ICommitStrategy from './ICommitStrategy';
import { IObjectMetadata } from '../index';

export const BASIC_COMMIT_STRATEGY = 'basic';

/**
 * BasicCommitStrategy implements the 'basic' commit strategy
 */
export default class BasicCommitStrategy implements ICommitStrategy {
  resolveObject (objectId: string, commits: any[]): Promise<{
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  }> {
    throw new Error(`Method not implemented. ${objectId}, ${commits.length}`);
  }

}
