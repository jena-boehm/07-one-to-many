const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const fs = require('fs');
const Musician = require('../lib/models/musician');


describe('test endpoints', () => {


  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });


  it('returns all musicians', async() => {

    const musiciansArray = await Promise.all([
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

    expect(response.body).toEqual(expect.arrayContaining(musiciansArray));
    expect(response.body).toHaveLength(musiciansArray.length);
  });


  it('returns a single musician by id', async() => {

    const musician = await Musician.insert({ 
      name: 'Billie Eilish',
      country: 'United States',
      age: '18'
    });
    
    const response = await request(app)
      .get(`/musicians/${musician.id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(musician);
  });


  it('creates a new musician', async() => {
    const newMusician = {
      name: 'Mahalia',
      country: 'England',
      age: '22'
    };

    const response = await request(app)
      .post('/musicians')
      .send(newMusician)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({...newMusician, id: '1' });
  });


  it('updates a musician by id', async() => {
    
    const musician = await Musician.insert({ 
      name: 'Billie Eilish',
      country: 'United States',
      age: '18'
    });

    const updatedMusician = {
      name: 'Mereba',
      country: 'United States',
      age: '30'
    };

    const response = await request(app)
      .put(`/musicians/${musician.id}`)
      .send(updatedMusician)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ ...updatedMusician, id: '1' });
  });

  it('deletes a musician by id', async() => {

    const musician = await Musician.insert({ 
      name: 'Billie Eilish',
      country: 'United States',
      age: '18'
    });
    
    const response = await request(app)
      .delete(`/musicians/${musician.id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(musician);
  });
});
