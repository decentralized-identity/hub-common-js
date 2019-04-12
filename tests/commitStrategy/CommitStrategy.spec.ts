import CommitStrategy from '../../src/commitStrategy/CommitStrategy';
import ICommit from '../../src/commits/ICommit';
import IObjectMetadata from '../../src/objects/IObjectMetadata';
import TestCommit from '../../src/commits/TestCommit';
import CommitOperation from '../../src/commits/CommitOperation';

class TestCommitStrategy extends CommitStrategy {
  resolveObject(_: string, __: ICommit[]): {
    /** metadata */
    metadata: IObjectMetadata,
    /** payload data */
    data: any} {
    throw new Error('An appropriate spy must be used');
  }
}

describe('CommitStrategy', () => {
  const commitStrategy = new TestCommitStrategy();

  describe('filterCommits', () => {
    it('should remove any commits with objectIds that do not match', () => {
      const objectId = 'correct object id';
      const commits = [
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
          },
        }),
        new TestCommit({
          protected: {
            object_id: objectId,
            operation: CommitOperation.Update,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
          },
        }),
        new TestCommit({
          protected: {
            object_id: objectId,
            operation: CommitOperation.Update,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
          },
        }),
        new TestCommit({
          protected: {
            object_id: objectId,
            operation: CommitOperation.Update,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
          },
        }),
      ];
      const strategy = commits[0].getProtectedHeaders().commit_strategy;
      const filteredCommits = commitStrategy['filterCommits'](objectId, strategy!, commits);
      expect(filteredCommits.length).toEqual(3);
      expect(filteredCommits).toContain(commits[1]);
      expect(filteredCommits).toContain(commits[3]);
      expect(filteredCommits).toContain(commits[5]);
    });

    it('should remove commits with commit strategies that do not match', () => {
      const objectId = 'an object id';
      const strategy = 'correct strategy';
      const commits = [
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
            object_id: objectId,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Delete,
            object_id: objectId,
            commit_strategy: strategy,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Delete,
            object_id: objectId,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
            object_id: objectId,
            commit_strategy: strategy,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
            object_id: objectId,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
            object_id: objectId,
            commit_strategy: strategy,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
            object_id: objectId,
          },
        }),
      ];
      const filteredCommits = commitStrategy['filterCommits'](objectId, strategy, commits);
      expect(filteredCommits.length).toEqual(3);
      expect(filteredCommits).toContain(commits[1]);
      expect(filteredCommits).toContain(commits[3]);
      expect(filteredCommits).toContain(commits[5]);
    });

    it('should remove creates whos revision does not match the object id', () => {
      const objectId = 'an object id';
      const commits = [
        new TestCommit({
          protected: {
            operation: CommitOperation.Create,
          },
          unprotected: {
            rev: objectId,
          },
        }),
        new TestCommit({
          protected: {
            operation: CommitOperation.Create,
          },
          unprotected: {
            rev: `not ${objectId}`,
          },
        }),
      ];
      const strategy = commits[0].getProtectedHeaders().commit_strategy;
      const filteredCommits = commitStrategy['filterCommits'](objectId, strategy!, commits);
      expect(filteredCommits.length).toEqual(1);
      expect(filteredCommits).toContain(commits[0]);
    });
  });
});
