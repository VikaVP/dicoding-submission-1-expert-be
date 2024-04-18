const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      owner: 'user-1',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: '2024-04-15T12:00:00.000Z',
      owner: useCasePayload.owner,
    });

    const mockingThreadRepository = new ThreadRepository();

    mockingThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedThread({
        id: 'thread-1',
        title: useCasePayload.title,
        body: useCasePayload.body,
        date: '2024-04-15T12:00:00.000Z',
        owner: useCasePayload.owner,
      }),
    ));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockingThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);

    expect(mockingThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});