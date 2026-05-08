import whatsappSettingModel from "../../../models/chit/whatsappSettingModel.js";

class WhatsAppRepository {
  async findOne(branchId) {
    try {
      const whatsappData = await whatsappSettingModel.findOne({
        id_branch: branchId,
      });

      if (!whatsappData) {
        return null;
      }

      return whatsappData;
    } catch (error) {
      console.error(error);
    }
  }

  async updateWhatsappSettings(id, data) {
    try {
      const updatedData = await whatsappSettingModel.updateOne(
        { _id: id },
        { $set: data },
        { new: true },
      );

      if (updatedData.matchedCount === 0) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error(error);
    }
  }

  async addWhatsappSetting(data) {
    try {
      const savedData = await whatsappSettingModel.create(data);

      if (!savedData) {
        return null;
      }

      return savedData;
    } catch (error) {
      console.error(error);
    }
  }

  async findByBranch(branchId) {
    try {
      const data = await whatsappSettingModel
        .findOne({ id_branch: branchId })
        .populate([
          {
            path: "id_branch",
            select: "_id branch_name",
          },
        ])
        .select("-createdAt -updatedAt -__v")
        .lean();

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getByBranchAndProjectId(branchId, projectId) {
    try {
      const data = await whatsappSettingModel
        .findOne({ id_branch: branchId })
        .populate([
          {
            path: "id_branch",
            select: "_id branch_name",
          },
        ])
        .select("-createdAt -updatedAt -__v")
        .lean();

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async exists(id_branch) {
    try {
      return !!(await whatsappSettingModel.findOne({ id_branch }));
    } catch (error) {
      console.error(`Error checking existence:`, error);
      return false;
    }
  }
}

export default WhatsAppRepository;
