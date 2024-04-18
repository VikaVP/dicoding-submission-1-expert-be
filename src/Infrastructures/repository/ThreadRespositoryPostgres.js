const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const { rows } = await this._pool.query(query);

    return new AddedThread(rows[0]);
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id,
            threads.title,
            threads.body,
            threads.date,
            users.username
            FROM threads
            LEFT JOIN users ON threads.owner = users.id
            WHERE threads.id = $1`,
      values: [threadId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rows[0];
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rowCount;
  }
}

module.exports = ThreadRepositoryPostgres;