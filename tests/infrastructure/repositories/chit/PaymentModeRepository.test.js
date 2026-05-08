import PaymentModeRepository from "../../../../src/infrastructure/repositories/chit/PaymentModeRepository.js";
import paymentModeModel from "../../../../src/infrastructure/models/chit/paymentModeModel.js";
import * as dbHandler from "../../../test-db-handler.js";
import mongoose from "mongoose";

describe("PaymentModeRepository - findOne", () => {
  let paymentModeRepository;

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
    paymentModeRepository = new PaymentModeRepository();
  });

  describe("findOne", () => {
    it("should find payment mode by id_mode", async () => {
      // Create test payment mode
      const paymentModeData = {
        id_project: new mongoose.Types.ObjectId(),
        id_mode: 11,
        mode_name: "CASH FREE",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      };

      await paymentModeModel.create(paymentModeData);

      // Test findOne
      const result = await paymentModeRepository.findOne({ id_mode: 11 });

      expect(result).toBeDefined();
      expect(result.id_mode).toBe(11);
      expect(result.mode_name).toBe("CASH FREE");
      expect(result._id).toBeDefined();
    });

    it("should return null if payment mode not found", async () => {
      const result = await paymentModeRepository.findOne({ id_mode: 999 });
      expect(result).toBeNull();
    });

    it("should find payment mode by mode_name", async () => {
      const paymentModeData = {
        id_project: new mongoose.Types.ObjectId(),
        id_mode: 12,
        mode_name: "UPI",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      };

      await paymentModeModel.create(paymentModeData);

      const result = await paymentModeRepository.findOne({ mode_name: "UPI" });

      expect(result).toBeDefined();
      expect(result.mode_name).toBe("UPI");
      expect(result.id_mode).toBe(12);
    });

    it("should only return active payment modes when queried", async () => {
      const projectId = new mongoose.Types.ObjectId();
      await paymentModeModel.create([
        {
          id_project: projectId,
          id_mode: 13,
          mode_name: "ACTIVE MODE",
          payment_method_type: "Online",
          active: true,
          is_deleted: false,
        },
        {
          id_project: projectId,
          id_mode: 14,
          mode_name: "INACTIVE MODE",
          payment_method_type: "Online",
          active: false,
          is_deleted: false,
        },
      ]);

      const activeResult = await paymentModeRepository.findOne({
        id_mode: 13,
        active: true,
      });

      const inactiveResult = await paymentModeRepository.findOne({
        id_mode: 14,
        active: true,
      });

      expect(activeResult).toBeDefined();
      expect(activeResult.mode_name).toBe("ACTIVE MODE");
      expect(inactiveResult).toBeNull();
    });
  });
});
