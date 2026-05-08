import AdminController from "../../../../../src/interfaces/controllers/chit/admin/AdminController.js";
import { jest } from "@jest/globals";

const mockAdminUseCase = {
  findAdmin: jest.fn(),
  addAdmin: jest.fn(),
  changeActiveState: jest.fn(),
  deleteAdmin: jest.fn(),
};

describe("AdminController", () => {
  let adminController;
  let req;
  let res;

  beforeEach(() => {
    adminController = new AdminController(mockAdminUseCase);
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return 200 and token on success", async () => {
      req.body = { username: "user", password: "pass" };
      const mockResult = {
        success: true,
        message: "Login successful",
        token: "token",
        user: {},
      };
      mockAdminUseCase.findAdmin.mockResolvedValue(mockResult);

      await adminController.login(req, res);

      expect(mockAdminUseCase.findAdmin).toHaveBeenCalledWith("user", "pass");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: mockResult.message,
        token: mockResult.token,
        user: mockResult.user,
      });
    });

    it("should return 400 for bad requests (Not found)", async () => {
      req.body = { username: "user", password: "pass" };
      mockAdminUseCase.findAdmin.mockResolvedValue({
        success: false,
        message: "Not found",
      });

      await adminController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
    });

    it("should return 403 for deactivated user", async () => {
      req.body = { username: "user", password: "pass" };
      mockAdminUseCase.findAdmin.mockResolvedValue({
        success: false,
        message: "Deactivated",
      });

      await adminController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Deactivated" });
    });

    it("should return 500 on unexpected error", async () => {
      req.body = { username: "user", password: "pass" };
      mockAdminUseCase.findAdmin.mockRejectedValue(new Error("Async error"));

      await adminController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Internal server error" }),
      );
    });
  });

  describe("addNewAdmin", () => {
    it("should return 200 on success", async () => {
      req.body = { email: "new@example.com" };
      mockAdminUseCase.addAdmin.mockResolvedValue({
        success: true,
        message: "Created",
      });

      await adminController.addNewAdmin(req, res);

      expect(mockAdminUseCase.addAdmin).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Created" });
    });

    it("should return 400 on failure", async () => {
      req.body = { email: "new@example.com" };
      mockAdminUseCase.addAdmin.mockResolvedValue({
        success: false,
        message: "Exists",
      });

      await adminController.addNewAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Exists" });
    });
  });

  describe("changeActiveState", () => {
    it("should return 200 on success", async () => {
      req.params.id = "123";
      mockAdminUseCase.changeActiveState.mockResolvedValue({
        success: true,
        message: "Updated",
      });

      await adminController.changeActiveState(req, res);

      expect(mockAdminUseCase.changeActiveState).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if success is false but status is missing/false", async () => {
      req.params.id = "123";
      mockAdminUseCase.changeActiveState.mockResolvedValue({
        success: false,
        message: "Failed",
      });

      await adminController.changeActiveState(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("deleteAdmin", () => {
    it("should return 200 on success", async () => {
      req.params.id = "123";
      mockAdminUseCase.deleteAdmin.mockResolvedValue({
        success: true,
        message: "Deleted",
      });

      await adminController.deleteAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if id is missing", async () => {
      // req.params.id is undefined by default
      await adminController.deleteAdmin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "ID required" });
    });
  });
});
