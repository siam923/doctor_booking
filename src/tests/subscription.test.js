const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Role = require('../models/Role');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const DoctorSubscription = require('../models/DoctorSubscription');
const PaymentInfo = require('../models/PaymentInfo');

jest.setTimeout(60000); // Increase timeout to 60 seconds

const request = supertest(app);

let adminToken;
let doctorToken;
let adminId;
let doctorId;
let planId;
let adminRoleId, doctorRoleId;

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
  await SubscriptionPlan.deleteMany({});
  await DoctorSubscription.deleteMany({});
  await PaymentInfo.deleteMany({});

  // Create roles
  const adminRole = await Role.create({
    name: 'admin',
    description: 'Administrator',
  });
  const doctorRole = await Role.create({
    name: 'doctor',
    description: 'Medical professional',
  });
  adminRoleId = adminRole._id;
  doctorRoleId = doctorRole._id;

  // Create admin user
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    phone: '01234567890',
    passwordHash: 'AdminPassword123',
    role: adminRoleId,
  });
  adminId = adminUser._id;

  // Create doctor user
  const doctorUser = await User.create({
    username: 'doctor',
    email: 'doctor@example.com',
    phone: '09876543210',
    passwordHash: 'DoctorPassword123',
    role: doctorRoleId,
  });
  doctorId = doctorUser._id;

  // Login as admin and doctor to get tokens
  const adminLoginRes = await request.post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'AdminPassword123',
  });
  adminToken = adminLoginRes.body.accessToken;

  const doctorLoginRes = await request.post('/api/auth/login').send({
    email: 'doctor@example.com',
    password: 'DoctorPassword123',
  });
  doctorToken = doctorLoginRes.body.accessToken;
});

describe('Subscription API Routes', () => {
  describe('Admin Routes', () => {
    let createdPlanId;

    describe('POST /api/subscriptions/plans', () => {
      it('should create a new subscription plan', async () => {
        const planData = {
          name: 'Basic Plan',
          description: 'Basic subscription plan',
          duration: 30,
          price: 1000,
          features: ['Feature 1', 'Feature 2'],
          specialtyCategory: 'general'
        };

        const response = await request
          .post('/api/subscriptions/plans')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(planData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(planData.name);
        planId = response.body.data._id;


        createdPlanId = response.body.data._id;
      });
    });

    describe('PUT /api/subscriptions/plans/:id', () => {
      it('should update an existing subscription plan', async () => {
        const plan = await SubscriptionPlan.create({
          name: 'Test Plan',
          description: 'Test Description',
          duration: 30,
          price: 1000,
          specialtyCategory: 'general'
        });
        createdPlanId = plan._id;

        const updatedData = {
          name: 'Updated Basic Plan',
          price: 1200
        };

        const response = await request
          .put(`/api/subscriptions/plans/${createdPlanId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(updatedData.name);
        expect(response.body.data.price).toBe(updatedData.price);
      });
    });

    describe('DELETE /api/subscriptions/plans/:id', () => {
      it('should delete an existing subscription plan', async () => {
        // Make sure we have a plan to delete
        const plan = await SubscriptionPlan.create({
          name: 'Test Plan',
          description: 'Test Description',
          duration: 30,
          price: 1000,
          specialtyCategory: 'general'
        });
        createdPlanId = plan._id;

        const response = await request
          .delete(`/api/subscriptions/plans/${createdPlanId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(204);
      });
    });

    describe('GET /api/subscriptions/plans', () => {
      it('should get all subscription plans', async () => {
        await SubscriptionPlan.create([
          { name: 'Plan 1', description: 'Description 1', duration: 30, price: 1000, specialtyCategory: 'general' },
          { name: 'Plan 2', description: 'Description 2', duration: 60, price: 2000, specialtyCategory: 'specialist' }
        ]);

        const response = await request
          .get('/api/subscriptions/plans')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });
    });

    describe('PUT /api/subscriptions/payment-info', () => {
      it('should update payment information', async () => {
        const paymentInfoData = {
          bkash: { number: '01711111111' },
          bank: {
            accountName: 'Test Account',
            accountNumber: '1234567890',
            bankName: 'Test Bank',
            branchName: 'Test Branch'
          }
        };

        const response = await request
          .put('/api/subscriptions/payment-info')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(paymentInfoData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.bkash.number).toBe(paymentInfoData.bkash.number);
      });
    });
  });

  describe('Doctor Routes', () => {
    let createdPlanId;

    beforeEach(async () => {
      const plan = await SubscriptionPlan.create({
        name: 'Test Plan',
        description: 'Test Description',
        duration: 30,
        price: 1000,
        specialtyCategory: 'general'
      });
      createdPlanId = plan._id;
    });
  
    describe('POST /api/subscriptions/subscribe', () => {
      it('should create a new subscription for a doctor', async () => {
        const subscriptionData = {
          planId: createdPlanId,
          paymentMethod: 'bkash',
          paymentDetails: { bkashNumber: '01711111111' }
        };
  
        const response = await request
          .post('/api/subscriptions/subscribe')
          .set('Authorization', `Bearer ${doctorToken}`)
          .send(subscriptionData);
  
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.doctorId).toBe(doctorId.toString());
        expect(response.body.data.planId).toBe(createdPlanId.toString());
      });
    });

    describe('GET /api/subscriptions/my-subscription', () => {
      it('should get the current subscription for a doctor', async () => {
        // Create a subscription for the doctor
        await DoctorSubscription.create({
          doctorId: doctorId,
          planId: createdPlanId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'active',
          paymentStatus: 'paid',
          paymentMethod: 'bkash',
          paymentDetails: { bkashNumber: '01711111111' }
        });

        const response = await request
          .get('/api/subscriptions/my-subscription')
          .set('Authorization', `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.doctorId).toBe(doctorId.toString());
        expect(response.body.data.planId._id).toBe(createdPlanId.toString());
      });
    });
  });

  describe('Public Routes', () => {
    describe('GET /api/subscriptions/payment-info', () => {
      it('should get payment information', async () => {
        await PaymentInfo.create({
          bkash: { number: '01711111111' },
          bank: {
            accountName: 'Test Account',
            accountNumber: '1234567890',
            bankName: 'Test Bank',
            branchName: 'Test Branch'
          }
        });
  
        const response = await request
          .get('/api/subscriptions/payment-info');
  
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.bkash.number).toBe('01711111111');
      });
    });
  });
});