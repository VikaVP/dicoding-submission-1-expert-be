const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRespositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });
      const newThread = new NewThread({
        title: 'Title',
        body: 'Dicoding Indonesia adalah platform belajar pemrograman online terbaik di Indonesia',
        owner: 'user-1',
      });

      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadTableTestHelper.findThreadsById('thread-1');
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-1',
          title: 'Title',
          owner: 'user-1',
        }),
      );
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });
      const newThreadPayload = {
        title: 'Title',
        body: 'Dicoding Indonesia test',
        owner: 'user-1',
      };
      const newThread = new NewThread(newThreadPayload);

      const fakeIdGenerator = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-321',
          title: 'Title',
          owner: 'user-1',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({
        id: 'thread-1',
      });

      const thread = await threadRepositoryPostgres.getThreadById('thread-1');

      expect(thread).toStrictEqual({
        id: 'thread-1',
        title: 'ini thread',
        body: 'ini body',
        date: new Date('2024-04-16T00:00:00.000Z'),
        username: 'dicoding',
      });
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-1' });

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1')).resolves.not.toThrowError(NotFoundError);
    });
  });
});