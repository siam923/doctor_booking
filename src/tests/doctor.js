const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Role = require("../models/Role");
const Specialization = require("../models/Specialization");

jest.setTimeout(60000); // Increase timeout to 60 seconds

const request = supertest(app);

let adminToken;
let doctorToken;
let doctorId;
let specializationId;
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
  await Doctor.deleteMany({});
  await Role.deleteMany({});
  await Specialization.deleteMany({});

  // Create roles
  const adminRole = await Role.create({
    name: "admin",
    description: "Administrator",
  });
  const doctorRole = await Role.create({
    name: "doctor",
    description: "Medical professional",
  });
  adminRoleId = adminRole._id;
  doctorRoleId = doctorRole._id;

  // Create admin user
  const adminUser = await User.create({
    username: "admin",
    email: "admin@example.com",
    phone: "01234567890",
    passwordHash: "AdminPassword123",
    role: adminRoleId,
  });

  // Create doctor user
  const doctorUser = await User.create({
    username: "doctor",
    email: "doctor@example.com",
    phone: "09876543210",
    passwordHash: "DoctorPassword123",
    role: doctorRoleId,
  });

  // Create specialization
  const specialization = await Specialization.create({
    name: "Cardiology",
    description: "Heart specialist",
  });
  specializationId = specialization._id;

  // Login as admin and doctor to get tokens
  const adminLoginRes = await request.post("/api/auth/login").send({
    email: "admin@example.com",
    password: "AdminPassword123",
  });
  adminToken = adminLoginRes.body.accessToken;

  const doctorLoginRes = await request.post("/api/auth/login").send({
    email: "doctor@example.com",
    password: "DoctorPassword123",
  });
  doctorToken = doctorLoginRes.body.accessToken;

  // Create a doctor profile
  const doctorProfile = await Doctor.create({
    userId: doctorUser._id,
    specialization: specializationId,
    qualifications: ["MBBS", "MD"],
    yearsOfExperience: 10,
    consultationFee: 1000,
    bio: "Experienced cardiologist",
    hospitals: ["City Hospital"],
    location: {
      type: "Point",
      coordinates: [90.4125, 23.8103],
    },
  });
  doctorId = doctorProfile._id;
});

describe("Doctor Management Endpoints", () => {
  describe("POST /api/doctors", () => {
    it("should create a new doctor profile", async () => {
      const newUser = await User.create({
        username: "newdoctor",
        email: "newdoctor@example.com",
        phone: "01122334455",
        passwordHash: "NewDoctorPassword123",
        role: doctorRoleId,
      });

      const newDoctor = {
        userId: newUser._id,
        specialization: specializationId,
        qualifications: ["MBBS", "MS"],
        yearsOfExperience: 5,
        consultationFee: 800,
        bio: "Skilled surgeon",
        hospitals: ["General Hospital"],
        location: {
          type: "Point",
          coordinates: [90.3, 23.7],
        },
      };

      const res = await request
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newDoctor);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
    });

    it("should return 403 if not admin", async () => {
      const newUser = await User.create({
        username: "anotherdoctor",
        email: "anotherdoctor@example.com",
        phone: "05544332211",
        passwordHash: "AnotherDoctorPassword123",
        role: doctorRoleId,
      });

      const newDoctor = {
        userId: newUser._id,
        specialization: specializationId,
        qualifications: ["MBBS"],
        yearsOfExperience: 3,
        consultationFee: 500,
        bio: "New doctor",
        hospitals: ["Local Clinic"],
        location: {
          type: "Point",
          coordinates: [90.4, 23.8],
        },
      };

      const res = await request
        .post("/api/doctors")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send(newDoctor);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/doctors", () => {
    it("should get all doctors with pagination", async () => {
      const res = await request.get("/api/doctors?page=1&limit=10");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toHaveProperty("totalCount");
    });

    it("should filter doctors by specialization", async () => {
      const res = await request.get(
        `/api/doctors?specialization=${specializationId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].specialization._id.toString()).toBe(
        specializationId.toString()
      );
    });
  });

  describe("GET /api/doctors/:id", () => {
    it("should get a specific doctor by ID", async () => {
      const res = await request.get(`/api/doctors/${doctorId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id.toString()).toBe(doctorId.toString());
    });

    it("should return 404 for non-existent doctor", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/doctors/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/doctors/:id", () => {
    it("should update a doctor profile", async () => {
      const updateData = {
        yearsOfExperience: 12,
        consultationFee: 1200,
        qualifications: ["MBBS", "MD", "DM"],
        bio: "Updated bio",
        hospitals: ["City Hospital", "General Hospital"],
        location: {
          type: "Point",
          coordinates: [90.4, 23.8],
        },
      };

      const res = await request
        .put(`/api/doctors/${doctorId}`)
        .set("Authorization", `Bearer ${doctorToken}`) // Use doctorToken instead of adminToken
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.yearsOfExperience).toBe(12);
      expect(res.body.data.consultationFee).toBe(1200);
    });

    it('should return 403 if not admin or the doctor themselves', async () => {
      const anotherDoctorUser = await User.create({
        username: 'anotherdoctor',
        email: 'anotherdoctor@example.com',
        phone: '05544332211',
        passwordHash: 'AnotherDoctorPassword123',
        role: doctorRoleId
      });
    
      const anotherDoctorLoginRes = await request.post('/api/auth/login').send({
        email: 'anotherdoctor@example.com',
        password: 'AnotherDoctorPassword123'
      });
      const anotherDoctorToken = anotherDoctorLoginRes.body.accessToken;
    
      const updateData = {
        yearsOfExperience: 15
      };
    
      const res = await request
        .put(`/api/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${anotherDoctorToken}`)
        .send(updateData);
    
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        success: false,
        message: 'Not authorized to update this doctor profile'
      });
    }); 
  });

  describe("GET /api/doctors/hospitals", () => {
    it("should get all hospitals", async () => {
      const res = await request.get("/api/doctors/hospitals");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toContain("City Hospital");
    });

    it("should filter hospitals by search term", async () => {
      const res = await request.get("/api/doctors/hospitals?search=City");

      expect(res.status).toBe(200);
      expect(res.body.data).toContain("City Hospital");
      expect(res.body.data).not.toContain("General Hospital");
    });
  });

  describe("GET /api/doctors/specializations", () => {
    it("should get all specializations", async () => {
      const res = await request.get("/api/doctors/specializations");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].name).toBe("Cardiology");
    });

    it("should filter specializations by search term", async () => {
      const res = await request.get("/api/doctors/specializations?search=Card");

      expect(res.status).toBe(200);
      expect(res.body.data[0].name).toBe("Cardiology");
    });
  });
});
