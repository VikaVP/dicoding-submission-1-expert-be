const DetailThead = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'ini thread',
      body: 'Isi thread',
      date: '2024',
      username: 'user-1',
    };

    expect(() => new DetailThead(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1,
      title: 'ini thread',
      body: 'Isi thread',
      date: '2024',
      username: 'user-1',
    };

    expect(() => new DetailThead(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'ini thread',
      body: 'Isi thread',
      date: '2024',
      username: 'user-1',
    };

    const {
      id, title, body, date, username,
    } = new DetailThead(payload);

    expect(id).toEqual(payload.id);

    expect(title).toEqual(payload.title);

    expect(body).toEqual(payload.body);

    expect(date).toEqual(payload.date);

    expect(username).toEqual(payload.username);
  });
});