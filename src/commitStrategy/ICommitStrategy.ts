import IObjectMetadata from '../objects/IObjectMetadata';

/**
 * Generic interface to add commit strategy algorithm support
 */
export default interface ICommitStrategy {

  // TODO: port the commit object from the Identity Hub such that commits is typed

  /**
   * Given an object id and corresponding commits, reconstructs the object according to the commit strategy
   * @param objectId Id of the object to reconstruct
   * @param commits All corresponding commits to use in the reconstruction
   * @returns The final state of the object according to the commit strategy in terms of metadata and data
   */
  resolveObject (objectId: string, commits: any[]): Promise<{
    /** Resolved object metadata */
    metadata: IObjectMetadata,
    /** Resolved object data */
    data: any;
  }>;
}
