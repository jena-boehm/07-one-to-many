const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const fs = require('fs');
const Musician = require('../lib/models/musician');


describe('test endpoints', () => {
  let musician;

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));

    musician = await Musician
      .insert({
        name: 'Billie Eilish',
        country: 'United States',
        age: '18'
      });
  });

  afterAll(() => {
    return pool.end();
  });

  it('returns all musicians', async() => {
    const response = await request(app)
      .get('/musicians')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual([musician]);
  });

  it('returns a single musician by id', async() => {
    
    const response = await request(app)
      .get(`/musicians/${musician.id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(musician);
  });

  it('creates a new musician', async() => {
    const newMusician = {
      id: '2',
      name: 'Mahalia',
      country: 'United Kingdom',
      age: '22'
    };

    const response = await request(app)
      .post('/musicians')
      .send({
        name: 'Mahalia',
        country: 'United Kingdom',
        age: '22'
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(newMusician);
  });
});
