const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    const mockingCommentRepository = new CommentRepository();

    mockingCommentRepository.verifyAvailableCommentInThread = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockingCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockingCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(1));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockingCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockingCommentRepository.verifyAvailableCommentInThread)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);

    expect(mockingCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockingCommentRepository.deleteCommentById)
      .toBeCalledWith(useCasePayload.commentId);
  });
});