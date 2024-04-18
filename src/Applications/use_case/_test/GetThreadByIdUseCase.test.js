const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-1',
    };

    const expectedThread = {
      id: 'thread-1',
      title: 'Judul thread',
      body: 'Isi thread',
      date: '2024',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-1',
        username: 'dicoding',
        date: '2024',
        content: 'Isi komentar',
        is_deleted: false
      },
    ];

    const expectedCommentsWithDeleted = expectedComments.map(({ is_deleted: deletedComment, ...otherProperties }) => otherProperties);

    const mockingThreadRepository = new ThreadRepository();
    const mockingCommentRepository = new CommentRepository();

    mockingThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockingCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const mockGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockingThreadRepository,
      commentRepository: mockingCommentRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(useCasePayload.threadId);

    expect(theThread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsWithDeleted,
    });
    expect(mockingThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockingCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });

  it('should not display deleted comment', async () => {
    const useCasePayload = {
      threadId: 'thread-1',
    };

    const expectedThread = {
      id: 'thread-1',
      title: 'Judul thread',
      body: 'Isi thread',
      date: '2024',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-1',
        username: 'dicoding',
        date: '2024',
        content: '**komentar telah dihapus**',
        is_deleted: true,
      },
    ];

    const expectedCommentsWithDeleted = expectedComments.map(({ is_deleted: deletedComment, ...otherProperties }) => otherProperties);

    const mockingThreadRepository = new ThreadRepository();
    const mockingCommentRepository = new CommentRepository();

    mockingThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockingCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const mockGetThreadUseCase = new GetThreadUseCase({
      commentRepository: mockingCommentRepository,
      threadRepository: mockingThreadRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(useCasePayload.threadId);

    expect(theThread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsWithDeleted,
    });
    expect(mockingThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockingCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});