/**
 * Enumeration of possible operations for a commit.
 */
enum CommitOperation {

  /** Used when creating a new object. */
  Create = 'create',

  /** Used when updating an existing object; requires that object_id is also specified in the commit headers. */
  Update = 'update',

  /** Used when deleting an existing object; requires that object_id is also specified in the commit headers. */
  Delete = 'delete',

}

export default CommitOperation;
