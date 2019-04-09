import IObjectMetadata from '../objects/IObjectMetadata';
import Commit from '../commits/Commit';
import CommitOperation from '../commits/CommitOperation';

/**
 * Generic interface to add commit strategy algorithm support
 */
export default abstract class CommitStrategy {
  /**
   * Given an object id and corresponding commits, reconstructs the object according to the commit strategy
   * @param objectId Id of the object to reconstruct
   * @param commits All corresponding commits to use in the reconstruction
   * @returns The final state of the object according to the commit strategy in terms of metadata and data
   */
  abstract resolveObject (objectId: string, commits: Commit[]): {
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  };

  /**
   * Filters a series of commits given an object id and commit strategy to match against
   * @param objectId Object ID all commits must be for
   * @param commitStrategy Commit strategy all commits must use
   * @param commits Commits to filter
   * @returns filtered commits
   */
  protected filterCommits(objectId: string, commitStrategy: string, commits: Commit[]): Commit[] {
    return commits.filter((commit) => {
      const headers = commit.getProtectedHeaders();
      if (headers.commit_strategy !== commitStrategy) {
        return false;
      }
      // filter updates and deletes on object ids (a required field)
      if (headers.operation !== CommitOperation.Create && headers.object_id !== objectId) {
        return false;
      }
      const unprotectedHeaders = commit.getHeaders();
      // filter creates on revision == object id (a necessary condition)
      if (headers.operation === CommitOperation.Create && unprotectedHeaders.rev && unprotectedHeaders.rev !== objectId) {
        return false;
      }
      return true;
    });
  }
}
