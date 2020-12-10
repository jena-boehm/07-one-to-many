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

    const musicians = await Promise.all([
      {
        name: 'Saba',
        country: 'United States',
        age: '26'
      },
      {
        name: 'Tom Misch',
        country: 'England',
        age: '25'
      },
      {
        name: 'Mahalia',
        country: 'England',
        age: '22'
      },
      {
        name: 'Little Simz',
        country: 'England',
        age: '26'
      }
    ].map(musician => Musician.insert(musician)));

    const response = await request(app)
      .get('/musicians')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining(musicians));
    expect(response.body).toHaveLength(musicians.length + 1);
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
      country: 'England',
      age: '22'
    };

    const response = await request(app)
      .post('/musicians')
      .send({
        name: 'Mahalia',
        country: 'England',
        age: '22'
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(newMusician);
  });


  // it('updates a musician by id', async() => {
  //   const updatedMusician = {
  //     id: '2',
  //     name: 'Mereba',
  //     country: 'United States',
  //     age: '30'
  //   };

  //   const response = await request(app)
  //     .put(`/musicians/${musician.id}`)
  //     .send({
  //       name: 'Mereba',
  //       country: 'United States',
  //       age: '30'
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(200);

  //   expect(response.body).toEqual(updatedMusician);
  // });
});
