const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-1',
      title: 'ini judul',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'thread-1',
      title: 'ini judul',
      owner: 14,
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread entities correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'ini judul',
      owner: 'user-1',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread).toBeInstanceOf(AddedThread);

    expect(addedThread.id).toEqual(payload.id);

    expect(addedThread.title).toEqual(payload.title);

    expect(addedThread.owner).toEqual(payload.owner);
  });
});