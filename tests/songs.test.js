const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const fs = require('fs');
const Song = require('../lib/models/Song.js');

describe('song endpoints', () => {

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
    
  afterAll(() => {
    return pool.end();
  });

  it('returns all songs', async() => {

    const songsArray = await Promise.all([
      {
        title: 'Lost in Paris',
        genre: 'Neo Soul / Jazz'
      },
      {
        title: 'Nightrider',
        genre: 'Neo Soul / Jazz'
      },
      {
        title: 'No Reply',
        genre: 'Neo Soul / R&B'
      },
      {
        title: 'Sober',
        genre: 'Neo Soul / R&B'
      },
    ].map(song => Song.insert(song)));

    const response = await request(app)
      .get('/songs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining(songsArray));
    expect(response.body).toHaveLength(songsArray.length);
  });
});
