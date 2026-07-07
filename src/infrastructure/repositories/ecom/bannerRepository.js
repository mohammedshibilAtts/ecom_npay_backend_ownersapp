import EcomBanner from "../../models/ecom/bannerModel.js";

class BannerRepository {
  async createBanner(data) {
    const banner = new EcomBanner(data);
    return await banner.save();
  }

  async getAllBanners(query = {}) {
    const { page = 1, limit = 10, search = "", active = "" } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const queryObj = {};

    if (search) {
      queryObj.title = { $regex: search, $options: "i" };
    }

    if (active === "true" || active === "1") {
      queryObj.isActive = true;
    } else if (active === "false" || active === "0") {
      queryObj.isActive = false;
    }

    const data = await EcomBanner.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await EcomBanner.countDocuments(queryObj);

    return { data, total };
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
