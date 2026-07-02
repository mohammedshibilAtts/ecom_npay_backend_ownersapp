class WebAuthController {
  constructor(webAuthUsecase) {
    this.webAuthUsecase = webAuthUsecase;
  }

  async signup(req, res) {
    try {
      const { firstname, mobile } = req.body;
      const { customer, token } = await this.webAuthUsecase.signup({ firstname, mobile });

      // Set the token as an HTTP-Only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return res.status(201).json({
        success: true,
        message: "Signup successful",
        data: {
          _id: customer._id,
          firstname: customer.firstname,
          mobile: customer.mobile
        }
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { mobile } = req.body;
      const { customer, token } = await this.webAuthUsecase.login(mobile);

      // Set the token as an HTTP-Only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          _id: customer._id,
          firstname: customer.firstname,
          mobile: customer.mobile
        }
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default WebAuthController;
