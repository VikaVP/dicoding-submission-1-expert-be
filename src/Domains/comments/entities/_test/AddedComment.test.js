const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1',
      content: 'ini komentar',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-1',
      content: 1,
      owner: 'user-1',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comment-1',
      content: 'ini komentar',
      owner: 'user-1',
    };

    const { id, content, owner } = new AddedComment(payload);

    expect(id).toEqual(payload.id);

    expect(content).toEqual(payload.content);

    expect(owner).toEqual(payload.owner);
  });
});