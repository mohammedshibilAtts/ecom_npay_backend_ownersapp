import AdminUseCase from "../../../../../src/usecases/auth/chit/admin/AdminUseCase.js";
import { jest } from "@jest/globals";

// Mock dependencies
const mockAdminRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  addNewAdmin: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  deleteAdmin: jest.fn(),
};

const mockHashingService = {
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
};

const mockTokenService = {
  generateToken: jest.fn(),
};

describe("AdminUseCase", () => {
  let adminUseCase;

  beforeEach(() => {
    adminUseCase = new AdminUseCase(
      mockAdminRepository,
      mockHashingService,
      mockTokenService,
    );
    jest.clearAllMocks();
  });

  describe("findAdmin (Login)", () => {
    it("should return success and token for valid credentials", async () => {
      const email = "test@example.com";
      const password = "password123";
      const mockAdmin = {
        _id: "adminId",
        email: email,
        password: "hashedPassword",
        active: true,
        is_super: false,
      };
      const mockToken = "mockToken";

      mockAdminRepository.findByEmail.mockResolvedValue(mockAdmin);
      mockHashingService.comparePassword.mockResolvedValue(true);
      mockTokenService.generateToken.mockReturnValue(mockToken);

      const result = await adminUseCase.findAdmin(email, password);

      expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockHashingService.comparePassword).toHaveBeenCalledWith(
        password,
        mockAdmin.password,
      );
      expect(mockTokenService.generateToken).toHaveBeenCalledWith({
        is_super: mockAdmin.is_super,
        id_admin: mockAdmin._id,
      });
      expect(result).toEqual({
        success: true,
        message: "Login successful",
        token: mockToken,
      });
    });

    it("should return failure if admin not found", async () => {
      mockAdminRepository.findByEmail.mockResolvedValue(null);

      const result = await adminUseCase.findAdmin(
        "test@example.com",
        "password",
      );

      expect(result).toEqual({ success: false, message: "Admin not found" });
    });

    it("should return failure if password in invalid", async () => {
      const mockAdmin = {
        _id: "adminId",
        email: "test@example.com",
        password: "hashedPassword",
      };
      mockAdminRepository.findByEmail.mockResolvedValue(mockAdmin);
      mockHashingService.comparePassword.mockResolvedValue(false);

      const result = await adminUseCase.findAdmin(
        "test@example.com",
        "wrongpassword",
      );

      expect(result).toEqual({
        success: false,
        message: "Invalid password or email",
      });
    });

    it("should return failure if admin is deactivated", async () => {
      const mockAdmin = {
        _id: "adminId",
        email: "test@example.com",
        password: "hashedPassword",
        active: false,
      };
      mockAdminRepository.findByEmail.mockResolvedValue(mockAdmin);
      mockHashingService.comparePassword.mockResolvedValue(true);

      const result = await adminUseCase.findAdmin(
        "test@example.com",
        "password",
      );

      expect(result).toEqual({
        success: false,
        message: "Admin is deactivated",
      });
    });
  });

  describe("addAdmin", () => {
    it("should create admin successfully", async () => {
      const adminData = { email: "new@example.com", password: "password" };
      mockAdminRepository.findByEmail.mockResolvedValue(null);
      mockHashingService.hashPassword.mockResolvedValue("hashedPassword");
      mockAdminRepository.addNewAdmin.mockResolvedValue({
        username: "newadmin",
      });

      const result = await adminUseCase.addAdmin(adminData);

      expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith(
        adminData.email,
      );
      expect(mockHashingService.hashPassword).toHaveBeenCalledWith(
        "password",
        12,
      );
      expect(mockAdminRepository.addNewAdmin).toHaveBeenCalledWith({
        ...adminData,
        password: "hashedPassword",
      });
      expect(result).toEqual({
        success: true,
        message: "Admin created successfully",
      });
    });

    it("should return failure if email already exists", async () => {
      mockAdminRepository.findByEmail.mockResolvedValue({}); // Exists

      const result = await adminUseCase.addAdmin({
        email: "exists@example.com",
      });

      expect(result).toEqual({
        success: false,
        message: "Email already exists",
      });
    });
  });

  describe("changeActiveState", () => {
    it("should update status successfully", async () => {
      const adminId = "someId";
      const mockAdmin = { _id: adminId, active: true };
      const updatedAdmin = { ...mockAdmin, active: false };

      mockAdminRepository.findById.mockResolvedValue(mockAdmin);
      mockAdminRepository.updateStatus.mockResolvedValue(updatedAdmin);

      const result = await adminUseCase.changeActiveState(adminId);

      expect(mockAdminRepository.findById).toHaveBeenCalledWith(adminId);
      expect(mockAdminRepository.updateStatus).toHaveBeenCalledWith(
        adminId,
        mockAdmin,
      );
      expect(result).toEqual({
        success: true,
        message: "Deactivated admin successfully",
        data: updatedAdmin,
      });
    });
    it("should return error if admin not found", async () => {
      mockAdminRepository.findById.mockResolvedValue(null);

      const result = await adminUseCase.changeActiveState("invalidId");

      expect(result).toEqual({ success: false, message: "Admin not found" });
    });
  });

  describe("deleteAdmin", () => {
    it("should delete admin successfully", async () => {
      const adminId = "someId";
      const mockAdmin = { _id: adminId, is_deleted: false };
      const deletedAdmin = { ...mockAdmin, is_deleted: true };

      mockAdminRepository.findById.mockResolvedValue(mockAdmin);
      mockAdminRepository.deleteAdmin.mockResolvedValue(deletedAdmin);

      const result = await adminUseCase.deleteAdmin(adminId);

      expect(mockAdminRepository.findById).toHaveBeenCalledWith(adminId);
      expect(mockAdminRepository.deleteAdmin).toHaveBeenCalledWith(adminId);
      expect(result).toEqual({
        success: true,
        message: "Admin deleted successfully",
        data: deletedAdmin,
      });
    });
  });
});
