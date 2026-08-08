class ChitRedeemController {
  constructor(chitRedeemUsecase) {
    this.chitRedeemUsecase = chitRedeemUsecase;
  }

  async findSchemeAccount(req, res) {
    try {
      const { mobile, scheme_acc_number } = req.query;

      if (!mobile && !scheme_acc_number) {
        return res.status(400).json({
          success: false,
          message: "Mobile or Scheme Account no is required",
        });
      }

      const result = await this.chitRedeemUsecase.findSchemeAccount({
        mobile,
        scheme_acc_number,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async closeAccount(req, res) {
    try {
      const result = await this.chitRedeemUsecase.closeAccount(req.body);
      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
        });
      }
    
      return res.status(400).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async dayBookReport(req, res) {
    try {
      const result = await this.chitRedeemUsecase.dayBookReport(req.query);
      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
        });
      }
      return res.status(400).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async addWalletPoints(req, res) {
    try {
      const result = await this.chitRedeemUsecase.addWalletPoints(req.body, req.erpUser);
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      }
      return res.status(400).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async redeemWalletPoints(req, res) {
    try {
      const result = await this.chitRedeemUsecase.redeemWalletPoints(req.body, req.erpUser);
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      }
      return res.status(400).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

export default ChitRedeemController;
