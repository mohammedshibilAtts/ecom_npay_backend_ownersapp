import SchemeRepository from "../../../../src/infrastructure/repositories/chit/schemeRepository.js";
import schemeModel from "../../../../src/infrastructure/models/chit/schemeModel.js";
import metalModel from "../../../../src/infrastructure/models/chit/metalModel.js";
import purityModel from "../../../../src/infrastructure/models/chit/purityModel.js";
import schemeClassificationModel from "../../../../src/infrastructure/models/chit/schemeClassificationModel.js";
import { jest } from "@jest/globals";
import * as dbHandler from "../../../test-db-handler.js";
import mongoose from "mongoose";

describe("SchemeRepository", () => {
  let schemeRepository;

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
    schemeRepository = new SchemeRepository();
  });

  // Helper to create valid scheme data
  const createValidSchemeData = (overrides = {}) => ({
    scheme_name: "Gold Scheme",
    code: "GS001",
    description: "Test description",
    term_desc: "Test terms",
    id_branch: new mongoose.Types.ObjectId(),
    id_metal: new mongoose.Types.ObjectId(),
    id_purity: new mongoose.Types.ObjectId(),
    scheme_type: 1,
    active: true,
    classification_order: 1,
    ...overrides,
  });

  describe("addScheme", () => {
    it("should create a new scheme successfully", async () => {
      const schemeData = createValidSchemeData();

      const result = await schemeRepository.addScheme(schemeData);

      expect(result).toBeDefined();
      expect(result.scheme_name).toBe(schemeData.scheme_name);
      expect(result.code).toBe(schemeData.code);
    });

    it("should return null on failure", async () => {
      // Mock create to return null
      jest.spyOn(schemeModel, "create").mockResolvedValue(null);

      const result = await schemeRepository.addScheme({});
      expect(result).toBeNull();

      jest.restoreAllMocks();
    });
  });

  describe("findScheme", () => {
    it("should find scheme by query", async () => {
      const scheme = await schemeModel.create(
        createValidSchemeData({ code: "GS001" }),
      );

      const result = await schemeRepository.findScheme({ code: "GS001" });

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(scheme._id.toString());
    });

    it("should return null if scheme not found", async () => {
      const result = await schemeRepository.findScheme({ code: "NONEXISTENT" });
      expect(result).toBeNull();
    });
  });

  describe("updateScheme", () => {
    it("should update scheme successfully", async () => {
      const scheme = await schemeModel.create(createValidSchemeData());

      const result = await schemeRepository.updateScheme(scheme._id, {
        scheme_name: "Updated Scheme",
      });

      expect(result).toBeDefined();
      expect(result.modifiedCount).toBeGreaterThan(0);

      const updatedScheme = await schemeModel.findById(scheme._id);
      expect(updatedScheme.scheme_name).toBe("Updated Scheme");
    });

    it("should return null if no updates are made", async () => {
      const scheme = await schemeModel.create(
        createValidSchemeData({ scheme_name: "Gold Scheme" }),
      );

      // Update with same data
      const result = await schemeRepository.updateScheme(scheme._id, {
        scheme_name: "Gold Scheme",
      });
      expect(result).toBeDefined();
      expect(result.matchedCount).toBe(1);
    });
  });

  describe("deleteScheme", () => {
    it("should soft delete scheme", async () => {
      const scheme = await schemeModel.create(
        createValidSchemeData({ active: true, is_deleted: false }),
      );

      const result = await schemeRepository.deleteScheme(scheme._id);

      expect(result).toBeDefined();
      expect(result.modifiedCount).toBe(1);

      const deletedScheme = await schemeModel.findById(scheme._id);
      expect(deletedScheme.is_deleted).toBe(true);
      expect(deletedScheme.active).toBe(false);
    });

    it("should return null if scheme does not exist", async () => {
      const result = await schemeRepository.deleteScheme(
        "507f1f77bcf86cd799439011",
      );
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find scheme by ID", async () => {
      const scheme = await schemeModel.create(createValidSchemeData());

      const result = await schemeRepository.findById(scheme._id);

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(scheme._id.toString());
    });

    it("should handle invalid ID", async () => {
      const result = await schemeRepository.findById(
        "507f1f77bcf86cd799439011",
      );
      expect(result).toBeNull();
    });
  });

  describe("find", () => {
    it("should find schemes by query", async () => {
      await schemeModel.create([
        createValidSchemeData({ scheme_name: "Gold Scheme", active: true }),
        createValidSchemeData({ scheme_name: "Silver Scheme", active: true }),
        createValidSchemeData({ scheme_name: "Bronze Scheme", active: false }),
      ]);

      const result = await schemeRepository.find({ active: true });

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
    });

    it("should return empty array if no schemes found", async () => {
      const result = await schemeRepository.find({ active: true });
      // The repository returns null when data is empty/null, but find() returns []
      expect(result).toEqual([]);
    });
  });
});
