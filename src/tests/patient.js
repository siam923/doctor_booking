// tests/patient.test.js

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Role = require("../models/Role");

jest.setTimeout(60000); // Increase timeout to 60 seconds

const request = supertest(app);

let patientToken;
let patientId;
let patientRoleId;

beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGO_URI}/test`);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Role.deleteMany({});

  // Create patient role
  const patientRole = await Role.create({
    name: "patient",
    description: "Regular patient",
  });
  patientRoleId = patientRole._id;

  // Create patient user
  const patientUser = await User.create({
    username: "patient",
    email: "patient@example.com",
    phone: "01234567890",
    passwordHash: "PatientPassword123",
    role: patientRoleId,
  });

  // Login as patient to get token
  const patientLoginRes = await request.post("/api/auth/login").send({
    email: "patient@example.com",
    password: "PatientPassword123",
  });
  patientToken = patientLoginRes.body.accessToken;

  // Create a patient profile
  const patientProfile = await Patient.create({
    userId: patientUser._id,
    dateOfBirth: new Date("1990-01-01"),
    gender: "male",
    medicalHistory: [
      {
        condition: "Asthma",
        diagnosisDate: new Date("2010-01-01"),
        notes: "Mild asthma",
      },
    ],
    allergies: ["Peanuts"],
  });
  patientId = patientProfile._id;
});

describe("Patient Management Endpoints", () => {
  describe("POST /api/patients/register", () => {
    it("should register a new patient profile", async () => {
      const newUser = await User.create({
        username: "newpatient",
        email: "newpatient@example.com",
        phone: "09876543210",
        passwordHash: "NewPatientPassword123",
        role: patientRoleId,
      });
  
      // Login as the new user to get a token
      const loginRes = await request.post("/api/auth/login").send({
        email: "newpatient@example.com",
        password: "NewPatientPassword123",
      });
      const newPatientToken = loginRes.body.accessToken;
  
      const newPatient = {
        dateOfBirth: "1995-05-15",
        gender: "female",
        medicalHistory: [
          {
            condition: "Allergies",
            diagnosisDate: "2015-03-01",
            notes: "Seasonal allergies",
          },
        ],
        allergies: ["Dust"],
      };
  
      const res = await request
        .post("/api/patients/register")
        .set("Authorization", `Bearer ${newPatientToken}`)
        .send(newPatient);
  
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.patient).toHaveProperty("_id");
    });
  });

  describe("GET /api/patients/profile", () => {
    it("should get the patient's profile", async () => {
      const res = await request
        .get("/api/patients/profile")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.patient).toHaveProperty("_id");
      expect(res.body.data.patient.gender).toBe("male");
    });
  });

  describe("PUT /api/patients/profile", () => {
    it("should update the patient's profile", async () => {
      const updateData = {
        gender: "female",
        allergies: ["Peanuts", "Shellfish"],
      };

      const res = await request
        .put("/api/patients/profile")
        .set("Authorization", `Bearer ${patientToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.patient.gender).toBe("female");
      expect(res.body.data.patient.allergies).toContain("Shellfish");
    });
  });

  describe("POST /api/patients/medical-history", () => {
    it("should add a new medical history entry", async () => {
      const newEntry = {
        condition: "Hypertension",
        diagnosisDate: "2020-06-15",
        notes: "Mild hypertension, managed with diet and exercise",
      };

      const res = await request
        .post("/api/patients/medical-history")
        .set("Authorization", `Bearer ${patientToken}`)
        .send(newEntry);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.patient.medicalHistory).toHaveLength(2);
      expect(res.body.data.patient.medicalHistory[1].condition).toBe("Hypertension");
    });
  });

  describe("GET /api/patients/appointments", () => {
    it("should get the patient's appointment history", async () => {
      const res = await request
        .get("/api/patients/appointments")
        .set("Authorization", `Bearer ${patientToken}`);
  
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("appointments");
      expect(res.body.data).toHaveProperty("currentPage");
      expect(res.body.data).toHaveProperty("totalAppointments");
      expect(res.body.data).toHaveProperty("totalPages");
    });
  });

  describe("POST /api/patients/favorite-doctors/:doctorId", () => {
    it("should add a doctor to favorite doctors list", async () => {
      const fakeDoctorid = new mongoose.Types.ObjectId();
      const res = await request
        .post(`/api/patients/favorite-doctors/${fakeDoctorid}`)
        .set("Authorization", `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.patient.favoriteDoctors).toContain(fakeDoctorid.toString());
    });
  });
});