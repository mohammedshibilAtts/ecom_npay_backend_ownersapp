import AdminRepository from "../../../../src/infrastructure/repositories/chit/AdminRepository.js";
import adminModel from "../../../../src/infrastructure/models/chit/adminModel.js";
import * as dbHandler from "../../../test-db-handler.js";

describe("AdminRepository", () => {
  let adminRepository;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(() => {
    adminRepository = new AdminRepository();
  });

  describe("addNewAdmin", () => {
    it("should create a new admin successfully", async () => {
      const adminData = {
        email: "test@example.com",
        username: "testadmin",
        password: "hashedpassword",
        is_super: false,
      };

      const result = await adminRepository.addNewAdmin(adminData);

      expect(result).toBeDefined();
      expect(result.username).toBe(adminData.username);

      const savedAdmin = await adminModel.findOne({ email: adminData.email });
      expect(savedAdmin).toBeDefined();
      expect(savedAdmin.username).toBe(adminData.username);
    });
  });

  describe("findByEmail", () => {
    it("should return admin data if email exists", async () => {
      const adminData = {
        email: "test@example.com",
        username: "testadmin",
        password: "hashedpassword",
      };
      await adminModel.create(adminData);

      const result = await adminRepository.findByEmail(adminData.email);

      expect(result).toBeDefined();
      expect(result.email).toBe(adminData.email);
      expect(result.username).toBeUndefined();
    });

    it("should return null if email does not exist", async () => {
      const result = await adminRepository.findByEmail(
        "nonexistent@example.com",
      );
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return admin data if valid ID exists", async () => {
      const adminData = {
        email: "test@example.com",
        username: "testadmin",
        password: "hashedpassword",
      };
      const createdAdmin = await adminModel.create(adminData);

      const result = await adminRepository.findById(createdAdmin._id);

      expect(result).toBeDefined();
      expect(result.email).toBe(adminData.email);
      expect(result.username).toBe(adminData.username);
    });

    it("should return null if ID is invalid", async () => {
      const result = await adminRepository.findById("invalid-id");
      expect(result).toBeNull();
    });

    it("should return null if ID does not exist", async () => {
      const result = await adminRepository.findById("507f1f77bcf86cd799439011");
      expect(result).toBeNull();
    });
  });

  describe("start updateStatus", () => {
    it("should toggle active status", async () => {
      const adminData = {
        email: "test@example.com",
        username: "testadmin",
        password: "hashedpassword",
        active: true,
      };
      const createdAdmin = await adminModel.create(adminData);

      const result = await adminRepository.updateStatus(createdAdmin._id, {
        active: true,
      });

      expect(result).toBeDefined();
      expect(result.active).toBe(false);

      const updatedAdmin = await adminModel.findById(createdAdmin._id);
      expect(updatedAdmin.active).toBe(false);
    });
  });

  describe("deleteAdmin", () => {
    it("should set is_deleted to true", async () => {
      const adminData = {
        email: "test@example.com",
        username: "testadmin",
        password: "hashedpassword",
        is_deleted: false,
      };
      const createdAdmin = await adminModel.create(adminData);

      const result = await adminRepository.deleteAdmin(createdAdmin._id);

      expect(result).toBeDefined();
      expect(result.is_deleted).toBe(true);

      const deletedAdmin = await adminModel.findById(createdAdmin._id);
      expect(deletedAdmin.is_deleted).toBe(true);
    });
  });
});
