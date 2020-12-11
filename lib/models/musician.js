const pool = require('../utils/pool');
const Song = require('./Song');


module.exports = class Musician {
    id;
    name;
    country;
    age;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
      this.country = row.country;
      this.age = row.age;
    }

    // FIND METHODS
    static async find() {
      const { rows } = await pool.query('SELECT * FROM musicians');
      return rows.map(row => new Musician(row));
    }

    static async findById(id) {
      const { rows } = await pool.query(`
      SELECT
        musicians.*,
        array_to_json(array_agg(songs.*)) AS songs 
      FROM musicians
      JOIN songs
        ON musicians.id = songs.musician_id
      WHERE musicians.id=$1
      GROUP BY musicians.id
      `, [id]
      );

      if(!rows[0]) throw new Error(`No musician with ${id}.`);

      return {
        ...new Musician(rows[0]),
        songs: rows[0].songs.map(song => new Song(song))
      };
    }

    // INSERT METHOD
    static async insert({ name, country, age }) {
      const { rows } = await pool.query(`
        INSERT INTO musicians (name, country, age)
        VALUES ($1, $2, $3)
        RETURNING *
        `, [name, country, age]
      );
      return new Musician(rows[0]);
    }

    //UPDATE METHOD
    static async update(id, { name, country, age }) {
      const { rows } = await pool.query(`
      UPDATE musicians
      SET name=$1,
          country=$2,
          age=$3
      WHERE id=$4
      RETURNING *
      `, [name, country, age, id]
      );

      if(!rows[0]) throw new Error('No musician with id ${id}.');

      return new Musician(rows[0]);
    }

    //DELETE METHOD
    static async delete(id) {
      const { rows } = await pool.query(`
        DELETE FROM musicians
        WHERE id=$1
        RETURNING *
        `, [id]
      );
      return new Musician(rows[0]);
    }

};
