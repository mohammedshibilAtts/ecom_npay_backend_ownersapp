import CustomerRepository from "../../../../../infrastructure/repositories/chit/CustomerRepository.js";
import NotifyUsecase from "../../../../../usecases/auth/chit/client/notifyUseCase.js";
class NotifyController {
  constructor() {
    this.customerRepo = new CustomerRepository();
    this.notifyUsecase = new NotifyUsecase();
  }

  async addNotification(req, res) {
    try {
      const { id_branch, id_scheme, customer_id } = req.body;

      if (!id_branch || !Array.isArray(id_branch) || id_branch.length === 0) {
        return res
          .status(400)
          .json({ message: "Branch ID(s) required as an array" });
      }

      if (!req.body.title || !req.body.body) {
        return res
          .status(400)
          .json({ message: "Title and message are required" });
      }
      const data = req.body;
      const files = req.files;

      const result = await this.notifyUsecase.addNotification(
        data,
        files,
        req.user,
      );
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res
        .status(201)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // add promotion
  async addPromotion(req, res) {
    try {
      const { id_branch, id_scheme, customer_id, title, body, selectAll } =
        req.body;

      if (!id_branch || !Array.isArray(id_branch) || id_branch.length === 0) {
        return res
          .status(400)
          .json({ message: "Branch ID(s) required as an array" });
      }

      if (!title || !body) {
        return res
          .status(400)
          .json({ message: "Title and message are required" });
      }

      const data = {
        ...req.body,
        id_scheme,
        customer_id,
        id_branch,
        selectAll,
      };

      const files = req?.files?.noti_image;

      const result = await this.notifyUsecase.addPromotion(
        data,
        files,
        req.user,
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res
        .status(201)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Notification List with Pagination
  async pushnotificationTable(req, res) {
    try {
      const { page = 1, limit = 10 } = req.body;

      if (isNaN(page) || parseInt(page) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
      }
      if (isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ message: "Invalid limit number" });
      }

      const result = await this.notifyUsecase.pushnotificationTable(req.body);
      res
        .status(200)
        .json({
          success: true,
          message: result.message,
          data: result.data,
          totalDocument: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Notification List with Pagination
  async promotionTable(req, res) {
    try {
      const { page = 1, limit = 10 } = req.body;

      if (isNaN(page) || parseInt(page) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
      }
      if (isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ message: "Invalid limit number" });
      }

      const result = await this.notifyUsecase.promotionTable(req.body);

      res
        .status(200)
        .json({
          success: true,
          message: result.message,
          data: result.data,
          totalDocuments: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Notification by ID
  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.notifyUsecase.getNotificationById(id);

      if (!result.success) {
        return res
          .status(404)
          .json({ success: false, message: result.message });
      }
      res
        .status(200)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete Notification
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "No ID provided" });
      }

      const result = await this.notifyUsecase.deleteNotification(id);
      if (!result.success) {
        return res
          .status(404)
          .json({ success: false, message: result.message });
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Promotion List with Pagination
  async getPromotionList(req, res) {
    try {
      const { page = 1, limit = 10 } = req.body;

      if (isNaN(page) || parseInt(page) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
      }
      if (isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ message: "Invalid limit number" });
      }

      const result = await this.promotionUseCase.getPromotionList(req.body);
      res
        .status(200)
        .json({
          success: true,
          message: result.message,
          data: result.data,
          total: result.total,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Promotion by ID
  async getPromotionById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.promotionUseCase.getPromotionById(id);

      if (!result.success) {
        return res
          .status(404)
          .json({ success: false, message: result.message });
      }
      res
        .status(200)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete Promotion
  async deletePromotion(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "No ID provided" });
      }

      const result = await this.promotionUseCase.deletePromotion(id);
      if (!result.success) {
        return res
          .status(404)
          .json({ success: false, message: result.message });
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSchemeCustomers(req, res) {
    try {
      const { id_scheme, page, limit } = req.body;

      if (!Array.isArray(id_scheme) || id_scheme.length === 0) {
        return res.status(400).json({
          success: false,
          message: "id_scheme must be a non-empty array",
        });
      }

      const result = await this.notifyUsecase.getSchemeCustomers({
        id_scheme,
        page,
        limit,
      });

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        totalPages: result.totalPages,
        totalDocument: result.totalDocuments,
        currentPage: result.currentPage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCustomers(req, res) {
    try {
      const { page, limit, search } = req.body;

      if (!page) {
        return res.status(400).json({
          success: false,
          message: "page is required",
        });
      }
      if (!limit) {
        return res.status(400).json({
          success: false,
          message: "limit is required",
        });
      }

      const result = await this.notifyUsecase.getCustomers(page, limit, search);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        totalPages: result.totalPages,
        totalDocument: result.totalDocuments,
        currentPage: result.currentPage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default NotifyController;
