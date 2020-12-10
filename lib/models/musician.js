const pool = require('../utils/pool');

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

    static async insert({ name, country, age }) {
      const { rows } = await pool.query(
        `INSERT INTO musicians (name, country, age)
            VALUES ($1, $2, $3)
            RETURNING *`, 
        [name, country, age]
      );

      return new Musician(rows[0]);
    }
};
