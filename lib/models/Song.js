const pool = require('../utils/pool');

module.exports = class Song {
    id;
    title;
    genre;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.genre = row.genre;
    }

    //FIND METHODS
    static async find() {
      const { rows } = await pool.query('SELECT * FROM songs');
      return rows.map(row => new Song(row));
    }

    static async findById(id) {
      const { rows } = await pool.query(`
        SELECT * 
        FROM songs
        WHERE id=$1
        `, [id]
      );
  
      if(!rows[0]) throw new Error(`No song with ${id}.`);
  
      return new Song(rows[0]);
    }

    // INSERT METHOD
    static async insert({ title, genre }) {
      const { rows } = await pool.query(`
          INSERT INTO songs (title, genre)
          VALUES ($1, $2)
          RETURNING *
          `, [title, genre]
      );
      return new Song(rows[0]);
    }

    //UPDATE METHOD
    static async update(id, { title, genre }) {
      const { rows } = await pool.query(`
        UPDATE songs
        SET title=$1,
            genre=$2
        WHERE id=$3
        RETURNING *
        `, [title, genre, id]
      );
  
      if(!rows[0]) throw new Error('No song with id ${id}.');
  
      return new Song(rows[0]);
    }

    //DELETE METHOD
    static async delete(id) {
      const { rows } = await pool.query(`
          DELETE FROM songs
          WHERE id=$1
          RETURNING *
          `, [id]
      );
      return new Song(rows[0]);
    }
};
