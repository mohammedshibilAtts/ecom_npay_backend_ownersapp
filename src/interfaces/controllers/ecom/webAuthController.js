class WebAuthController {
  constructor(webAuthUsecase) {
    this.webAuthUsecase = webAuthUsecase;
  }

  async signup(req, res) {
    try {
      const { firstname, mobile } = req.body;
      const { customer, token } = await this.webAuthUsecase.signup({ firstname, mobile });

      res.cookie('token', token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
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

      res.cookie('token', token, {
        path: "/",
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
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
        sameSite: 'none'
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async authMe(req, res) {
    try {
      let token = null;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies.cookie) {
        token = req.cookies.cookie;
      } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      if (!token) {
        return res.status(401).json({ message: "Invalid token, Please login again" });
      }

      const customer = await this.webAuthUsecase.authMe(token);

      return res.status(200).json({
        success: true,
        message: "user data retrived successfully",
        data: {
          _id: customer._id,
          firstname: customer.firstname,
          mobile: customer.mobile
        }
      });
    } catch (error) {
      return res.status(401).json({ message: "Invalid token, Please login again" });
    }
  }
}

export default WebAuthController;
