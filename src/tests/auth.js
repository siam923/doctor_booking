const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Role = require('../models/Role');

jest.setTimeout(60000); // Increase timeout to 60 seconds

const request = supertest(app);

beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGO_URI}/test`);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Role.deleteMany({});

  // Create roles
  await Role.create({ name: 'patient', description: 'Regular patient' });
  await Role.create({ name: 'doctor', description: 'Medical professional' });
});


describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request.post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        phone: '01234567890',
        password: 'Password123',
        role: 'patient'
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should return 400 for invalid input', async () => {
      const res = await request.post('/api/auth/register').send({
        username: 'test',
        email: 'invalid-email',
        phone: '123',
        password: 'weak',
        role: 'invalid-role'
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const patientRole = await Role.findOne({ name: 'patient' });
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        phone: '01234567890',
        passwordHash: 'Password123',
        role: patientRole._id
      });
    });

    it('should login an existing user', async () => {
      const res = await request.post('/api/auth/login').send({
        email: 'existing@example.com',
        password: 'Password123'
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 400 for invalid credentials', async () => {
      const res = await request.post('/api/auth/login').send({
        email: 'existing@example.com',
        password: 'WrongPassword'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let refreshToken;

    beforeEach(async () => {
      const patientRole = await Role.findOne({ name: 'patient' });
      const user = await User.create({
        username: 'refreshuser',
        email: 'refresh@example.com',
        phone: '01234567890',
        passwordHash: 'Password123',
        role: patientRole._id
      });

      const loginRes = await request.post('/api/auth/login').send({
        email: 'refresh@example.com',
        password: 'Password123'
      });

      refreshToken = loginRes.body.refreshToken;
    });

    it('should refresh the access token', async () => {
      const res = await request.post('/api/auth/refresh-token').send({
        refreshToken: refreshToken
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 400 for invalid refresh token', async () => {
      const res = await request.post('/api/auth/refresh-token').send({
        refreshToken: 'invalid-token'
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid refresh token');
    });
  });
});