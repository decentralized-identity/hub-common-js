import LastWriterWinsCommitStrategy, { LAST_WRITER_WINS_COMMIT_STRATEGY } from '../../src/commitStrategy/LastWriterWinsCommitStrategy';
import TestCommit from '../../src/commits/TestCommit';
import CommitOperation from '../../src/commits/CommitOperation';
import Commit from '../../src/commits/Commit';

describe('LastWriterWinsCommitStrategy', () => {
  const commitStrategy = new LastWriterWinsCommitStrategy();

  describe('resolveObject', () => {
    const objectId = `object-id-${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`;
    const testCases: [
        string, // Expected return and why
        Commit[], // commits to feed in
        number, // index of payload
        number, // index of create
      ][] = [
        [
          'create if none other are defined',
          [
            new TestCommit({
              protected: {
                operation: CommitOperation.Create,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
              },
              unprotected: {
                rev: objectId,
              },
            }),
          ],
          0,
          0,
        ],
        [
          'update over create',
          [
            new TestCommit({
              protected: {
                operation: CommitOperation.Create,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
              },
              unprotected: {
                rev: objectId,
              },
            }),
            new TestCommit({
              protected: {
                operation: CommitOperation.Update,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
                object_id: objectId,
              },
            }),
          ],
          1,
          0,
        ],
        [
          'delete over update and create',
          [
            new TestCommit({
              protected: {
                operation: CommitOperation.Create,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
              },
              unprotected: {
                rev: objectId,
              },
            }),
            new TestCommit({
              protected: {
                operation: CommitOperation.Update,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
                object_id: objectId,
              },
            }),
            new TestCommit({
              protected: {
                operation: CommitOperation.Delete,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
                object_id: objectId,
              },
            }),
          ],
          2,
          0,
        ],
        [
          'update with static metadata from create',
          [
            new TestCommit({
              protected: {
                operation: CommitOperation.Create,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
                iss: 'did:test:originalIssuer.id',
                committed_at: new Date(0).toString(),
              },
              unprotected: {
                rev: objectId,
              },
            }),
            new TestCommit({
              protected: {
                operation: CommitOperation.Update,
                commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
                iss: 'did:test:editorIssuer.id',
                committed_at: new Date().toString(),
                object_id: objectId,
              },
            }),
          ],
          1,
          0,
        ],
      ];

    testCases.forEach((testCase) => {
      const [title, commits, payloadIndex, createIndex] = testCase;
      const payload = commits[payloadIndex].getPayload();
      const meta = commits[payloadIndex].getHeaders().meta;
      const staticMeta = commits[createIndex].getHeaders();
      it(`should return the ${title}`, () => {
        const actual = commitStrategy.resolveObject(objectId, commits);
        expect(actual.metadata.created_by).toEqual(staticMeta.iss);
        expect(actual.metadata.created_at).toEqual(staticMeta.committed_at);
        expect(actual.metadata.id).toEqual(objectId);
        expect(actual.metadata.meta).toEqual(meta);
        expect(actual.data).toEqual(payload);
      });
    });

    it('should throw when missing the create commit', () => {
      const objectId = 'testNoCreate';
      const commits = [
        new TestCommit({
          protected: {
            operation: CommitOperation.Update,
            commit_strategy: LAST_WRITER_WINS_COMMIT_STRATEGY,
            committed_at: new Date().toString(),
            object_id: objectId,
          },
        }),
      ];
      try {
        commitStrategy.resolveObject(objectId, commits);
        fail('expected to throw');
      } catch (error) {
        expect(error.message).toContain('missing create commit');
      }
    });
  });
});
