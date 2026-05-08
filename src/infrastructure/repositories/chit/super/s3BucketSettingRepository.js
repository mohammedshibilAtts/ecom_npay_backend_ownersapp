import s3BucketModel from "../../../models/chit/s3BucketSettingModel.js";

class S3BucketRepository {
  async exists(id_branch) {
    try {
      return await s3BucketModel.findOne({ id_branch });
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateOne(id, data) {
    try {
      return await s3BucketModel.updateOne({ _id: id }, { $set: data });
    } catch (error) {
      console.error("Error updating s3 bucket settings:", error);
      return null;
    }
  }

  async addSettings(data) {
    try {
      const newSetting = new s3BucketModel(data);
      return await newSetting.save();
    } catch (error) {
      console.error("Error adding s3 bucket settings:", error);
      return null;
    }
  }

  async getSettingByBranch(branchId) {
    try {
      return await s3BucketModel
        .find({ id_branch: branchId })
        .select("-createdAt -updatedAt ");
    } catch (error) {
      console.error("Error fetching s3 bucket settings by branch:", error);
      return null;
    }
  }

  async getSettingByClient(branchId) {
    try {
      return await s3BucketModel
        .findOne({ id_branch: branchId })
        .select("-createdAt -updatedAt ");
    } catch (error) {
      console.error("Error fetching s3 bucket settings by branch:", error);
      return null;
    }
  }

  async getSetting() {
    try {
      return await s3BucketModel.findOne({}).select("-createdAt -updatedAt ");
    } catch (error) {
      console.error("Error fetching s3 bucket settings:", error);
      return null;
    }
  }

  async getByProjectAndBranch(projectId, branchId) {
    try {
      return await s3BucketModel.findOne({ id_branch: branchId });
    } catch (error) {
      console.error("Error fetching s3 bucket settings by branch:", error);
      return null;
    }
  }
}

export default S3BucketRepository;
