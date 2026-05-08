import PaymentUseCase from "../../../../../src/usecases/auth/chit/client/paymentUseCase.js";
import { jest } from "@jest/globals";

describe("PaymentUseCase - completePayment PaymentMode Integration", () => {
  let paymentUseCase;
  let mockPaymentModeRepo;
  let mockPaymentOrderRepo;

  beforeEach(() => {
    // Create minimal mocks
    mockPaymentModeRepo = {
      findOne: jest.fn(),
    };

    mockPaymentOrderRepo = {
      findAndUpdate: jest.fn(),
    };

    // Add mocks for other repositories used in completePayment
    const mockPaymentRepository = {
      findNew: jest.fn().mockResolvedValue([]),
    };

    const mockSchemeAccountRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const mockSchemeRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const mockCustomerRepo = {
      findById: jest.fn().mockResolvedValue(null),
    };

    // Initialize PaymentUseCase with mocks
    paymentUseCase = new PaymentUseCase(
      mockPaymentRepository,
      null, // metalRateRepository
      mockSchemeRepository,
      mockSchemeAccountRepository,
      null, // customerRewardRepository
      null, // transactionDetailsRepository
      null, // transactionRepository
      null, // smsRepo
      null, // topupRepo
      mockPaymentOrderRepo,
      mockCustomerRepo,
      mockPaymentModeRepo,
      null, // employeeRepo
      null, // walletRepo
      null, // notificationconfig
    );

    // Override the paymentModeRepo since it's instantiated in the constructor
    paymentUseCase.paymentModeRepo = mockPaymentModeRepo;

    jest.clearAllMocks();
  });

  describe("PaymentModeRepository.findOne Integration", () => {
    it("should call paymentModeRepo.findOne with id_mode: 11 when completePayment is called", async () => {
      const orderId = "test-order-123";
      const cfPaymentId = "cf-payment-456";
      const customerId = "customer-789";

      // Mock payment mode
      const mockPaymentMode = {
        _id: "payment-mode-id-123",
        id_mode: 11,
        mode_name: "CASH FREE",
        payment_method_type: "Online",
        active: true,
      };

      // Mock payment order - must return valid object for function to proceed to findOne call
      const mockPaymentOrder = {
        orderId: orderId,
        cf_payment_id: cfPaymentId,
        status: 1,
        scheme_payment_ids: [], // Empty array to avoid further processing
      };

      mockPaymentOrderRepo.findAndUpdate.mockResolvedValue(mockPaymentOrder);
      mockPaymentModeRepo.findOne.mockResolvedValue(mockPaymentMode);

      // Create proper data structure for completePayment
      const paymentData = {
        data: {
          order: {
            order_id: orderId,
          },
          payment: {
            cf_payment_id: cfPaymentId,
            payment_status: "SUCCESS",
          },
          customer_details: {
            customer_id: customerId,
          },
        },
      };

      // Call completePayment
      await paymentUseCase.completePayment(paymentData);

      // Verify paymentModeRepo.findOne was called with correct arguments
      expect(mockPaymentModeRepo.findOne).toHaveBeenCalledWith({ id_mode: 11 });
      expect(mockPaymentModeRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it("should handle case when payment mode is not found (returns null)", async () => {
      const orderId = "test-order-123";
      const cfPaymentId = "cf-payment-456";
      const customerId = "customer-789";

      // Mock payment mode not found
      mockPaymentModeRepo.findOne.mockResolvedValue(null);

      // Mock payment order - must return valid object for function to proceed to findOne call
      const mockPaymentOrder = {
        orderId: orderId,
        cf_payment_id: cfPaymentId,
        status: 1,
        scheme_payment_ids: [], // Empty array to avoid further processing
      };
      mockPaymentOrderRepo.findAndUpdate.mockResolvedValue(mockPaymentOrder);

      // Create proper data structure for completePayment
      const paymentData = {
        data: {
          order: {
            order_id: orderId,
          },
          payment: {
            cf_payment_id: cfPaymentId,
            payment_status: "SUCCESS",
          },
          customer_details: {
            customer_id: customerId,
          },
        },
      };

      // Call completePayment - should not throw error
      await expect(
        paymentUseCase.completePayment(paymentData),
      ).resolves.not.toThrow();

      // Verify paymentModeRepo.findOne was still called
      expect(mockPaymentModeRepo.findOne).toHaveBeenCalledWith({ id_mode: 11 });
    });

    it("should verify paymentModeRepo is properly initialized", () => {
      // Verify that paymentModeRepo exists and has findOne method
      expect(paymentUseCase.paymentModeRepo).toBeDefined();
      expect(paymentUseCase.paymentModeRepo.findOne).toBeDefined();
      expect(typeof paymentUseCase.paymentModeRepo.findOne).toBe("function");
    });
  });
});
