import CustomerRepository from "../../../../src/infrastructure/repositories/chit/CustomerRepository.js";
import customerModel from "../../../../src/infrastructure/models/chit/customerModel.js";
import * as dbHandler from "../../../test-db-handler.js";

describe("CustomerRepository", () => {
  let customerRepository;

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
    customerRepository = new CustomerRepository();
  });

  describe("addCustomer", () => {
    it("should create a new customer successfully", async () => {
      const customerData = {
        firstname: "John",
        lastname: "Doe",
        mobile: "1234567890",
        email: "john@example.com",
        active: true,
      };

      const result = await customerRepository.addCustomer(customerData);

      expect(result).toBeDefined();

      const savedCustomer = await customerModel.findById(result);
      expect(savedCustomer).toBeDefined();
      expect(savedCustomer.firstname).toBe(customerData.firstname);
      expect(savedCustomer.mobile).toBe(customerData.mobile);
    });
  });

  describe("existingUser", () => {
    it("should return customer if mobile exists", async () => {
      const customerData = {
        firstname: "John",
        lastname: "Doe",
        mobile: "1234567890",
        email: "john@example.com",
      };
      await customerModel.create(customerData);

      const result = await customerRepository.existingUser("1234567890");

      expect(result).toBeDefined();
      expect(result.mobile).toBe("1234567890");
    });

    it("should return null if mobile does not exist", async () => {
      const result = await customerRepository.existingUser("9999999999");
      expect(result).toBeNull();
    });
  });

  describe("checkUser", () => {
    it("should return null if no other user has the mobile", async () => {
      const customer = await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
      });

      const result = await customerRepository.checkUser(
        customer._id,
        "9876543210",
      );
      expect(result).toBeNull();
    });

    it("should return existing user if mobile is taken by another user", async () => {
      const customer1 = await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
      });

      const customer2 = await customerModel.create({
        firstname: "Jane",
        mobile: "9876543210",
      });

      const result = await customerRepository.checkUser(
        customer1._id,
        "9876543210",
      );
      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(customer2._id.toString());
    });
  });

  describe("editCustomer", () => {
    it("should update customer data successfully", async () => {
      const customer = await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
      });

      const updateData = { firstname: "Johnny" };
      const result = await customerRepository.editCustomer(
        customer._id,
        updateData,
      );

      expect(result).toBeDefined();
      expect(result.matchedCount).toBeGreaterThan(0);

      const updatedCustomer = await customerModel.findById(customer._id);
      expect(updatedCustomer.firstname).toBe("Johnny");
    });

    it("should return null if customer does not exist", async () => {
      const result = await customerRepository.editCustomer(
        "507f1f77bcf86cd799439011",
        { firstname: "Test" },
      );
      expect(result).toBeNull();
    });
  });

  describe("deleteCustomer", () => {
    it("should soft delete customer", async () => {
      const customer = await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
        active: true,
        is_deleted: false,
      });

      const result = await customerRepository.deleteCustomer(customer._id);

      expect(result).toBeDefined();
      expect(result.matchedCount).toBeGreaterThan(0);

      const deletedCustomer = await customerModel.findById(customer._id);
      expect(deletedCustomer.is_deleted).toBe(true);
      expect(deletedCustomer.active).toBe(false);
    });
  });

  describe("activateCustomer", () => {
    it("should toggle customer active status", async () => {
      const customer = await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
        active: true,
      });

      const result = await customerRepository.activateCustomer(
        customer._id,
        true,
      );

      expect(result).toBeDefined();

      const updatedCustomer = await customerModel.findById(customer._id);
      expect(updatedCustomer.active).toBe(false);
    });
  });

  describe("searchCustomerByMobile", () => {
    it("should find customer by mobile", async () => {
      await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
        is_deleted: false,
      });

      const result =
        await customerRepository.searchCustomerByMobile("1234567890");

      expect(result).toBeDefined();
      expect(result.mobile).toBe("1234567890");
    });

    it("should return null for non-existent mobile", async () => {
      const result =
        await customerRepository.searchCustomerByMobile("9999999999");
      expect(result).toBeNull();
    });

    it("should not return deleted customers", async () => {
      await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
        is_deleted: true,
      });

      const result =
        await customerRepository.searchCustomerByMobile("1234567890");
      expect(result).toBeNull();
    });
  });

  describe("verifyMpin", () => {
    it("should verify correct MPIN", async () => {
      await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
        mpin: "1234",
      });

      const result = await customerRepository.verifyMpin("1234567890", "1234");
      expect(result).toBeDefined();
    });

    it("should return null for incorrect MPIN", async () => {
      await customerModel.create({
        firstname: "John",
        mobile: "1234567890",
        mpin: "1234",
      });

      const result = await customerRepository.verifyMpin("1234567890", "4321");
      expect(result).toBeNull();
    });
  });

  describe("countDocuments", () => {
    it("should return correct count of customers", async () => {
      await customerModel.create([
        { firstname: "John", mobile: "1111111111", is_deleted: false },
        { firstname: "Jane", mobile: "2222222222", is_deleted: false },
        { firstname: "Bob", mobile: "3333333333", is_deleted: true },
      ]);

      const result = await customerRepository.countDocuments({
        is_deleted: false,
      });
      expect(result).toBe(2);
    });
  });
});
