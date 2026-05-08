import PaymentRepository from "../../../../src/infrastructure/repositories/chit/paymentRepository.js";
import paymentModel from "../../../../src/infrastructure/models/chit/paymentModel.js";
import schemeModel from "../../../../src/infrastructure/models/chit/schemeModel.js";
import customerModel from "../../../../src/infrastructure/models/chit/customerModel.js";
import schemeAccountModel from "../../../../src/infrastructure/models/chit/schemeAccountModel.js";
import * as dbHandler from "../../../test-db-handler.js";
import mongoose from "mongoose";

describe("PaymentRepository", () => {
  let paymentRepository;

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
    paymentRepository = new PaymentRepository();
  });

  // Helper to create valid payment data
  const createValidPaymentData = (overrides = {}) => ({
    id_transaction: "TXN123",
    id_scheme: new mongoose.Types.ObjectId(),
    id_scheme_account: new mongoose.Types.ObjectId(),
    id_customer: new mongoose.Types.ObjectId(),
    id_branch: new mongoose.Types.ObjectId(),
    date_payment: new Date(),
    date_add: new Date(),
    paid_installments: 1,
    payment_type: 1,
    payment_amount: 1000,
    total_amt: 1000,
    payment_status: 1,
    added_by: 0,
    active: true,
    payment_receipt: "RCP001",
    ...overrides,
  });

  describe("addPayment", () => {
    it("should create a new payment successfully", async () => {
      const paymentData = createValidPaymentData();

      const result = await paymentRepository.addPayment(paymentData);

      expect(result).toBeDefined();
      expect(result.payment_amount).toBe(paymentData.payment_amount);
      expect(result.payment_receipt).toBe(paymentData.payment_receipt);
    });
  });

  describe("countDocuments", () => {
    it("should count active payments for scheme account", async () => {
      const schemeAccountId = new mongoose.Types.ObjectId();

      await paymentModel.create([
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: true,
          payment_status: 1,
        }),
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: true,
          payment_status: 1,
        }),
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: false, // inactive
          payment_status: 1,
        }),
      ]);

      const result = await paymentRepository.countDocuments(schemeAccountId);
      expect(result).toBe(2);
    });

    it("should return null if no payments found", async () => {
      const result = await paymentRepository.countDocuments(
        new mongoose.Types.ObjectId(),
      );
      expect(result).toBe(0);
    });
  });

  describe("findById", () => {
    it("should find payment by ID", async () => {
      const payment = await paymentModel.create(createValidPaymentData());

      const result = await paymentRepository.findById(payment._id);

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(payment._id.toString());
    });

    it("should return null for invalid ID", async () => {
      const result = await paymentRepository.findById(
        "507f1f77bcf86cd799439011",
      );
      expect(result).toBeNull();
    });
  });

  describe("lastPayment", () => {
    it("should return latest payment receipt for scheme", async () => {
      const schemeId = new mongoose.Types.ObjectId();

      await paymentModel.create([
        createValidPaymentData({
          id_scheme: schemeId,
          payment_receipt: "RCP001",
          createdAt: new Date("2024-01-01"),
        }),
        createValidPaymentData({
          id_scheme: schemeId,
          payment_receipt: "RCP002",
          createdAt: new Date("2024-01-02"),
        }),
        createValidPaymentData({
          id_scheme: schemeId,
          payment_receipt: "RCP003",
          createdAt: new Date("2024-01-03"),
        }),
      ]);

      const result = await paymentRepository.lastPayment(schemeId);

      expect(result).toBeDefined();
      expect(result.payment_receipt).toBe("RCP003");
    });

    it("should return null if no payments exist", async () => {
      const result = await paymentRepository.lastPayment(
        new mongoose.Types.ObjectId(),
      );
      expect(result).toBeNull();
    });
  });

  describe("totalInstallments", () => {
    it("should calculate total paid installments for scheme account", async () => {
      const schemeAccountId = new mongoose.Types.ObjectId();

      await paymentModel.create([
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: true,
          payment_status: 1,
          paid_installments: 3,
        }),
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: true,
          payment_status: 1,
          paid_installments: 2,
        }),
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: false, // inactive - should not count
          payment_status: 1,
          paid_installments: 1,
        }),
      ]);

      const result = await paymentRepository.totalInstallments(schemeAccountId);
      expect(result).toBe(5);
    });

    it("should return 0 if no payments found", async () => {
      const result = await paymentRepository.totalInstallments(
        new mongoose.Types.ObjectId(),
      );
      expect(result).toBe(0);
    });
  });

  describe("find", () => {
    it("should find payments for scheme account", async () => {
      const schemeAccountId = new mongoose.Types.ObjectId();

      await paymentModel.create([
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: true,
          payment_status: 1,
          payment_receipt: "RCP001",
        }),
        createValidPaymentData({
          id_scheme_account: schemeAccountId,
          active: true,
          payment_status: 1,
          payment_receipt: "RCP002",
        }),
      ]);

      const result = await paymentRepository.find(schemeAccountId);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return empty array if no payments found", async () => {
      const result = await paymentRepository.find(
        new mongoose.Types.ObjectId(),
      );
      expect(result).toEqual([]);
    });
  });
});
