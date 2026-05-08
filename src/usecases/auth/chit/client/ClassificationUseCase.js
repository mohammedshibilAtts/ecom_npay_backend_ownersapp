import { isValidObjectId } from "mongoose";
import config from "../../../../config/chit/env.js";
import s3Helper from "../../../../utils/s3Helper.js";

class ClassificationUseCase {
  constructor(classificationRepository, s3service,s3Repo) {
    this.classificationRepository = classificationRepository;
    this.s3service = s3service;
    this.s3Repo = s3Repo;
  }

  async addSchemeClassification(data, classifcationImg) {
    const existingClassificationName =
      await this.classificationRepository.findByName(data.name);

    if (existingClassificationName) {
      return { success: false, message: "Classificaiton name already in use" };
    }

    const s3Configs = await s3Helper()

    if (classifcationImg) {
      data.classifcationImg = await this.s3service.uploadToS3(classifcationImg, "classification",s3Configs);
    }

    const highestOrder = await this.classificationRepository.getHighestOrder();
    data.order = highestOrder + 1;

    const result = await this.classificationRepository.addSchemeClassification(
      data
    );

    if (!result) {
      return { success: false, message: "Failed to create classification" };
    }

    return { success: true, message: "Classification created successfully" };
  }

  async updateClassification(id, data, classifcationImg) {
    const existingClassification = await this.classificationRepository.findById(
      id
    );

    if (!existingClassification) {
      return { success: false, message: "No classification found" };
    }

    const s3Configs = await s3Helper()
    
    try {
      if (classifcationImg) {
        if (existingClassification.classifcationImg) {
          const keyPath = `${s3Configs.s3display_url}${config.AWS_LOCAL_PATH}classification/${existingClassification?.classifcationImg}`
          await this.s3service.deleteFromS3(keyPath,s3Configs);
        }
        data.classifcationImg = await this.s3service.uploadToS3(classifcationImg, "classification", s3Configs);
      }
    } catch (error) {
      console.error("Error during S3 operations:", error);
      return { success: false, message: "Error updating S3 files" };
    }

    const result = await this.classificationRepository.updateClassification(
      id,
      data
    );

    if (!result) {
      return { success: false, message: "Failed to update classification" };
    }

    return { success: true, message: "Classification updated successfully" };
  }

  async findById(id) {
    const result = await this.classificationRepository.findById(id);

    if (!result) {
      return { success: false, message: "No classification found" };
    }
    const s3Configs =await s3Helper()
    result.pathUrl = `${s3Configs.s3display_url}${config.AWS_LOCAL_PATH}classification/`
    return {
      success: true,
      message: "Classification retrieved successfully",
      data: result,
    };
  }

  async deleteClassification(id) {
    if (!isValidObjectId(id)) {
      return { success: false, message: "Invalid document ID" };
    }

    const classData = await this.classificationRepository.findById(id);

    if (!classData) {
      return { success: false, message: "No classification found" };
    }

    if (classData.is_deleted) {
      return { success: false, message: "Already deleted classification" };
    }

    const result = await this.classificationRepository.deleteClassification(id);

    if (!result) {
      return { success: false, message: "Failed to deleted classification" };
    }

    return { success: true, message: "Classification deleted successfully" };
  }

  async toggleActiveStatus(id) {
    if (!isValidObjectId(id)) {
      return { success: false, message: "Invalid document ID" };
    }

    const classData = await this.classificationRepository.findById(id);

    if (!classData) {
      return { success: false, message: "No classification found" };
    }

    if (classData.is_deleted) {
      return {
        success: false,
        message: "Deleted classification unable to activate",
      };
    }

    const updatedClass = await this.classificationRepository.toggleActiveStatus(
      id,
      classData.active
    );

    if (!updatedClass) {
      return {
        success: false,
        message: "Failed to change classification status",
      };
    }

    let message = updatedClass.active
      ? "Classification activated successfully"
      : "Classification deactivated";

    return { success: true, message: message };
  }

  async getAllActiveClassifications() {
    try {
      const data = await this.classificationRepository.findAll({
        active: true,
      });

      if (!data) {
        return { success: false, message: "No classifications found" };
      }

      return {
        success: true,
        message: "Classification data fetched successfully",
        data: data,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error while fetching classification data",
      };
    }
  }


  async getSchemeClassification() {
    try {
      const result = await this.classificationRepository.getSchemeClassification();

      if (result.length < 0) {
        return { success: false, message: "No scheme classification found" };
      }

      return {
        success: true,
        message: "Scheme lassification retrieved successfully",
        data: result,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error while fetching scheme classification data",
      };
    }
  }
}

export default ClassificationUseCase;