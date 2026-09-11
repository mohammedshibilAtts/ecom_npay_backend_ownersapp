import EcomBannerUsecase from "../ecom/bannerUsecase.js";

class BannerUsecase {
  constructor(bannerUsecaseOrRepo, s3Service) {
    if (bannerUsecaseOrRepo && typeof bannerUsecaseOrRepo.createBanner === "function") {
      this.actualBannerUsecase = bannerUsecaseOrRepo;
    } else {
      this.actualBannerUsecase = new EcomBannerUsecase(bannerUsecaseOrRepo, s3Service);
    }
  }

  async createBanner(data, file) {
    return await this.actualBannerUsecase.createBanner(data, file);
  }

  async getAllBanners(query) {
    return await this.actualBannerUsecase.getAllBanners(query);
  }

  async getActiveWebBanners() {
    return await this.actualBannerUsecase.getActiveWebBanners();
  }

  async updateBanner(id, data, file) {
    return await this.actualBannerUsecase.updateBanner(id, data, file);
  }

  async deleteBanner(id) {
    return await this.actualBannerUsecase.deleteBanner(id);
  }

  async toggleStatus(id) {
    return await this.actualBannerUsecase.toggleStatus(id);
  }
}

export default BannerUsecase;
