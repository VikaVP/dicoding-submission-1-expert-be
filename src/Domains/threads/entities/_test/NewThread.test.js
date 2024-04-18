const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      title: 'ini judul',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      title: 'ini judul',
      body: 14,
      owner: 'user-1',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    const payload = {
      title: 'ini judul',
      body: 'body',
      owner: 'user-1',
    };

    const newThread = new NewThread(payload);

    expect(newThread).toBeInstanceOf(NewThread);

    expect(newThread.title).toEqual(payload.title);

    expect(newThread.body).toEqual(payload.body);

    expect(newThread.owner).toEqual(payload.owner);
  });
});