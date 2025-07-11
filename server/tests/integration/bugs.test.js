const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app, connectDB } = require('../../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Bug API', () => {
  let bugId;

  test('should create a new bug', async () => {
    const res = await request(app)
      .post('/api/v1/bugs')
      .send({
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('title', 'Test Bug');
    bugId = res.body.data._id;
  });

  test('should get all bugs', async () => {
    const res = await request(app).get('/api/v1/bugs');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('should update a bug', async () => {
    const res = await request(app)
      .put(`/api/v1/bugs/${bugId}`)
      .send({ status: 'in-progress' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('in-progress');
  });

  test('should delete a bug', async () => {
    const res = await request(app).delete(`/api/v1/bugs/${bugId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test('should return 404 for non-existent bug', async () => {
    const res = await request(app).get(`/api/v1/bugs/${bugId}`);
    
    expect(res.statusCode).toEqual(404);
  });
});