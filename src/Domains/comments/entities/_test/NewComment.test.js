const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {

    const payload = {
      content: 'ini komentar',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      content: 1,
      threadId: 1,
      owner: 'user-1',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {

    const payload = {
      content: 'ini komentar',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    const { content, threadId, owner } = new NewComment(payload);

    expect(content).toEqual(payload.content);

    expect(threadId).toEqual(payload.threadId);
    
    expect(owner).toEqual(payload.owner);
  });
});