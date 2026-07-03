import EcomBanner from "../../models/ecom/bannerModel.js";

class BannerRepository {
  async createBanner(data) {
    const banner = new EcomBanner(data);
    return await banner.save();
  }

  async getAllBanners() {
    return await EcomBanner.find().sort({ createdAt: -1 });
  }

  async getActiveBanners() {
    return await EcomBanner.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async getBannerById(id) {
    return await EcomBanner.findById(id);
  }

  async updateBanner(id, data) {
    return await EcomBanner.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBanner(id) {
    return await EcomBanner.findByIdAndDelete(id);
  }
}

export default BannerRepository;
