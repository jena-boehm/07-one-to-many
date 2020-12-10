const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const fs = require('fs');

describe('test endpoints', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync(`${__dirname}/../sql/setup.sql`, 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new musician', async() => {
    const expected = {
      id: '1',
      name: 'Billie Eilish',
      country: 'United States',
      age: '18'
    };

    const response = await request(app)
      .post('/musicians')
      .send({
        name: 'Billie Eilish',
        country: 'United States',
        age: '18'
      });

    expect(response.body).toEqual(expected);
  });
});
