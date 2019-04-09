import BasicCommitStrategy, { BASIC_COMMIT_STRATEGY } from '../../src/commitStrategy/BasicCommitStrategy';
import TestCommit from '../../src/commits/TestCommit';
import CommitOperation from '../../src/commits/CommitOperation';
import Commit from '../../src/commits/Commit';

describe('BasicCommitStrategy', () => {
  const commitStrategy = new BasicCommitStrategy();

  describe('findEarliestCommit', () => {
    it('should throw if not given commits', () => {
      try {
        BasicCommitStrategy.findEarliestCommit([]);
        fail('expected to throw');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('resolveObject', () => {
    const objectId = `object-id-${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`;
    const testCases: [
      [
        string, // Expected return and why
        Commit[], // commits to feed in
        number, // index of payload
        number, // index of create
      ]
    ] = [
      [
        'create if none other are defined',
        [
          new TestCommit({
            protected: {
              operation: CommitOperation.Create,
              commit_strategy: BASIC_COMMIT_STRATEGY,
            },
            unprotected: {
              rev: objectId,
            },
          }),
        ],
        0,
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
  });
});
