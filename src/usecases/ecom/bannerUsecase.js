import sharp from "sharp";
import s3Helper from "../../utils/s3Helper.js";
import config from "../../config/chit/env.js";

class BannerUsecase {
  constructor(bannerRepository, s3Service) {
    this.bannerRepository = bannerRepository;
    this.s3Service = s3Service;
  }

  async processAndUploadImage(fileData) {
    // if (fileData.size > 2 * 1024 * 1024) {
    //   throw new Error("Image size must be less than 2MB");
    // }

    const s3Configs = await s3Helper();

    const webpBuffer = await sharp(fileData.buffer).webp({ quality: 80 }).toBuffer();

    const file = {
      buffer: webpBuffer,
      originalname: `banner_${Date.now()}.webp`,
      mimetype: "image/webp"
    };

    const fileName = await this.s3Service.uploadToS3(file, "banners", s3Configs);

    return `${s3Configs.s3display_url}${config.AWS_LOCAL_PATH}banners/${fileName}`;
  }

  async deleteImageFromS3(imageUrl) {
    if (!imageUrl || !imageUrl.startsWith('http')) return;
    try {
      const s3Configs = await s3Helper();
      const fileKey = imageUrl.replace(s3Configs.s3display_url, "");
      await this.s3Service.deleteFromS3(fileKey, s3Configs);
    } catch (error) {
      console.error("Error deleting old banner image from S3:", error);
    }
  }

  async createBanner(data, file) {
    if (!file) {
      throw new Error("Image file is required");
    }
    data.imageUrl = await this.processAndUploadImage(file);
    return await this.bannerRepository.createBanner(data);
  }

  async getAllBanners() {
    return await this.bannerRepository.getAllBanners();
  }

  async getActiveWebBanners() {
    const banners = await this.bannerRepository.getActiveBanners();
    const s3Configs = await s3Helper();
    const pathUrl = `${s3Configs.s3display_url}${config.AWS_LOCAL_PATH}banners/`;

    // Web API expects only the filename in imageUrl, plus the pathUrl
    const processedBanners = banners.map(b => {
      const filename = b.imageUrl.replace(pathUrl, "");
      return {
        _id: b._id,
        title: b.title,
        imageUrl: filename,
        isActive: b.isActive
      };
    });

    return {
      data: processedBanners,
      pathUrl: pathUrl
    };
  }

  async updateBanner(id, data, file) {
    const banner = await this.bannerRepository.getBannerById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }

    if (file) {
      data.imageUrl = await this.processAndUploadImage(file);

      await this.deleteImageFromS3(banner.imageUrl);
    }

    return await this.bannerRepository.updateBanner(id, data);
  }

  async deleteBanner(id) {
    const banner = await this.bannerRepository.getBannerById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }

    await this.deleteImageFromS3(banner.imageUrl);

    return await this.bannerRepository.deleteBanner(id);
  }

  async toggleStatus(id) {
    const banner = await this.bannerRepository.getBannerById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }
    return await this.bannerRepository.updateBanner(id, { isActive: !banner.isActive });
  }
}

export default BannerUsecase;
