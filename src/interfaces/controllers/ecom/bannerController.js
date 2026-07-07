class BannerController {
  constructor(bannerUsecase) {
    this.bannerUsecase = bannerUsecase;
  }

  async createBanner(req, res) {
    try {
      const banner = await this.bannerUsecase.createBanner(req.body, req.file);
      return res.status(201).json({ success: true, message: "Banner created successfully", data: banner });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllBanners(req, res) {
    try {
      const { page = 1, limit = 10, search = "", active = "" } = req.query;
      const result = await this.bannerUsecase.getAllBanners({ page, limit, search, active });
      return res.status(200).json({ 
        success: true, 
        data: result.data,
        totalDocuments: result.total,
        totalPages: Math.ceil(result.total / Number(limit)),
        page: Number(page),
        limit: Number(limit),
        pathUrl: result.pathUrl 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getActiveWebBanners(req, res) {
    try {
      const result = await this.bannerUsecase.getActiveWebBanners();
      return res.status(200).json({ 
        success: true, 
        data: result.data, 
        pathUrl: result.pathUrl 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateBanner(req, res) {
    try {
      const { id } = req.params;
      const banner = await this.bannerUsecase.updateBanner(id, req.body, req.file);
      return res.status(200).json({ success: true, message: "Banner updated successfully", data: banner });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteBanner(req, res) {
    try {
      const { id } = req.params;
      await this.bannerUsecase.deleteBanner(id);
      return res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const banner = await this.bannerUsecase.toggleStatus(id);
      return res.status(200).json({ success: true, message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`, data: banner });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default BannerController;
