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
      const requestBody = {...req.body,redeem_type:2}

      const result = await this.chitRedeemUsecase.redeemWalletPoints(requestBody, req.erpUser);
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          // data: result.data,
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

  async customerExists(req, res) {
    try {
      const { mobile } = req.query;

      if (!mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile no is required",
        });
      }

      const result = await this.chitRedeemUsecase.customerExists({
        mobile,
      });

      if(result.status){
        return res.status(200).json({
          success: true,
          exists: true,
          name: result.name,
          customer_id: result.customer_id,
        });
      }

      return res.status(400).json({
        success: false,
        exists: false,
        message: "Customer Not Found",
      });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async findWalletByMobile(req, res) {
    try {
      const { mobile } = req.query;

      if (!mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile no is required",
        });
      }

      const result = await this.chitRedeemUsecase.findWalletByMobile({ mobile });

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
        });
      }

      return res.status(400).json({
        success: false,
        message: result.message,
      });
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getPurchaseHistory(req, res) {
    try {
      const result = await this.chitRedeemUsecase.getPurchaseHistory(req.query);
      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage
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
