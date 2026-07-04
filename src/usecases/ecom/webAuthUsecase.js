import Customer from "../../infrastructure/models/chit/customerModel.js";
import TokenService from "../../utils/jwtToken.js";

class WebAuthUsecase {
  constructor() {
    this.tokenService = new TokenService();
  }

  async signup(data) {
    const { firstname, mobile } = data;

    if (!mobile || !firstname) {
      throw new Error("Firstname and mobile are required");
    }

    // Check if customer already exists
    let customer = await Customer.findOne({ mobile });
    if (customer) {
      throw new Error("Customer with this mobile number already exists");
    }

    // Create new customer with only the required web fields
    customer = new Customer({
      firstname,
      mobile,
      // You can add default values for web signups here if needed
    });

    await customer.save();

    // Generate JWT token
    const tokenPayload = {
      _id: customer._id,
      mobile: customer.mobile,
      role: 'customer'
    };

    const token = this.tokenService.generateToken(tokenPayload);

    return { customer, token };
  }

  async login(mobile) {
    if (!mobile) {
      throw new Error("Mobile number is required");
    }

    const customer = await Customer.findOne({ mobile });
    if (!customer) {
      throw new Error("Customer not found. Please sign up.");
    }

    if (!customer.active) {
      throw new Error("Account is inactive");
    }

    // Generate JWT token
    const tokenPayload = {
      _id: customer._id,
      mobile: customer.mobile,
      role: 'customer'
    };

    const token = this.tokenService.generateToken(tokenPayload);

    return { customer, token };
  }

  async authMe(token) {
    if (!token) {
      throw new Error("Token is required");
    }

    try {
      const decoded = await this.tokenService.verifyToken(token);
      const customer = await Customer.findById(decoded._id || decoded.id).select("_id firstname mobile");
      
      if (!customer) {
        throw new Error("Customer not found");
      }

      return customer;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

export default WebAuthUsecase;
