const pool = require('../../database/postgres/pool');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTestTableHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'User' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
    });

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addComment function', () => {
      it('addComment function should add database entry for said comment', async () => {
        const newComment = new NewComment({
          content: 'some content',
          threadId: 'thread-1',
          owner: 'user-1',
        });
        const fakeIdGenerator = () => '1';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        const addedComment = await commentRepositoryPostgres.addComment(newComment);
        const comments = await CommentsTableTestHelper.getCommentById(
          addedComment.id,
        );

        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-1',
          content: newComment.content,
          owner: newComment.owner,
        }));
        expect(comments).toHaveLength(1);
      });

      it('should return added comment correctly', async () => {
        const newComment = new NewComment({
          content: 'some content',
          threadId: 'thread-1',
          owner: 'user-1',
        });

        const fakeIdGenerator = () => '1';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        const addedComment = await commentRepositoryPostgres.addComment(newComment);

        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-1',
          content: newComment.content,
          owner: newComment.owner,
        }));
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should return true when comment owner is the same as the payload', async () => {
        const newComment = new NewComment({
          content: 'some content',
          threadId: 'thread-1',
          owner: 'user-1',
        });

        const fakeIdGenerator = () => '1';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await commentRepositoryPostgres.addComment(newComment);

        const isCommentOwner = await commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-1');

        expect(isCommentOwner).toBeTruthy();
      });

      it('should return Authorizationerror when comment owner is not the same as the payload', async () => {
        const newComment = new NewComment({
          content: 'some content',
          threadId: 'thread-1',
          owner: 'user-1',
        });

        const fakeIdGenerator = () => '1';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await commentRepositoryPostgres.addComment(newComment);

        await expect(
          commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-432'),
        ).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('getCommentByThreadId function', () => {
      it('should return all comments from a thread correctly', async () => {
        const firstComment = {
          id: 'comment-1',
          content: '1st comment',
          date: new Date('2024-04-16T00:00:00.000Z'),
        };
        const secondComment = {
          id: 'comment-2',
          content: '2nd comment',
          date: new Date('2024-04-17T01:00:00.000Z'),
        };

        await CommentsTableTestHelper.addComment(firstComment);
        await CommentsTableTestHelper.addComment(secondComment);
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        let commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');

        expect(commentDetails).toEqual([
          { ...firstComment,
              username: 'User',
              is_deleted: false,
              owner: "user-1",
              thread_id: "thread-1",
          },
          { ...secondComment,
            username: 'User',
            is_deleted: false,
            owner: "user-1",
            thread_id: "thread-1", },
        ]);
      });

      it('should return an empty array when no comments exist for the thread', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId(
          'thread-1',
        );
        expect(commentDetails).toStrictEqual([]);
      });
    });

    describe('verifyAvailableCommentInThread function', () => {
      it('should throw NotFoundError when thread is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread('thread-1', 'comment-1'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when comment is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread('thread-1', 'comment-1'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread and comment are available', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-1',
          content: 'first comment',
          date: new Date('2023-01-19T00:00:00.000Z'),
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread(
            'comment-1',
            'thread-1',
          ),
        ).resolves.not.toThrowError(NotFoundError);

        expect(await commentRepositoryPostgres.verifyAvailableCommentInThread(
          'comment-1',
          'thread-1',
        )).toBeGreaterThan(0);
      });
    });

    describe('deleteCommentById function', () => {
      it('should throw NotFoundError when comment is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.deleteCommentById('comment-1'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should delete comment correctly', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-1',
          content: 'first comment',
          date: new Date('2023-01-19T00:00:00.000Z'),
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        const deleteComment = await commentRepositoryPostgres.deleteCommentById('comment-1');

        const comment = await CommentsTableTestHelper.getCommentById(
          'comment-1',
        );
        expect(deleteComment).toBeGreaterThan(0);
        expect(comment[0].is_deleted).toEqual(true);
      });
    });
  });
});