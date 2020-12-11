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
      }
    ].map(song => Song.insert(song)));

    const response = await request(app)
      .get('/songs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining(songsArray));
    expect(response.body).toHaveLength(songsArray.length);
  });

  it('returns a single song by id', async() => {

    const song = await Song.insert({
      title: 'Lost in Paris',
      genre: 'Neo Soul / Jazz'
    });
    
    const response = await request(app)
      .get(`/songs/${song.id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(song);
  });

  it('creates a new song', async() => {
    const newSong = {
      title: 'Sober',
      genre: 'Neo Soul / R&B'
    };

    const response = await request(app)
      .post('/songs')
      .send(newSong)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ ...newSong, id: '1' });
  });

  it('updates a song by id', async() => {
    
    const song = await Song.insert({
      title: 'Sober',
      genre: 'Neo Soul / R&B'
    });

    const updatedSong = {
      title: 'No Reply',
      genre: 'Neo Soul / R&B'
    };

    const response = await request(app)
      .put(`/songs/${song.id}`)
      .send(updatedSong)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ ...updatedSong, id: '1' });
  });

  it('deletes a song by id', async() => {

    const song = await Song.insert({
      title: 'Nightrider',
      genre: 'Neo Soul / Jazz'
    });
    
    const response = await request(app)
      .delete(`/songs/${song.id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(song);
  });
});
