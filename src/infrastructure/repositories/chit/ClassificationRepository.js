import schemeClassificationModel from "../../models/chit/schemeClassificationModel.js";

class ClassificationRepository {
  async getSchemeClassification(){
    const classData= await schemeClassificationModel.find({active:true,is_deleted:false})

    if (classData.length > 0) {
        return classData;
      }
  
      return null;
  }

  async getHighestOrder() {
    try {
      const highest = await schemeClassificationModel
        .findOne({ is_deleted: false })
        .sort({ order: -1 })
        .select("order");
      return highest && highest.order ? highest.order : 0;
    } catch (error) {
      console.error("Error in getHighestOrder:", error);
      throw error;
    }
  }

  async findAll(query) {
    try {
      const data = await schemeClassificationModel.find(query);
      return data;
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findByName(name) {
    try {
      const exists = await schemeClassificationModel.findOne({ name: name });
      return exists;
    } catch (error) {
      console.error("Error in findByName:", error);
      throw error;
    }
  }

  async addSchemeClassification(data) {
    try {
      const classification = new schemeClassificationModel(data);
      const result = await classification.save();
      return result;
    } catch (error) {
      console.error("Error in addSchemeClassification:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const classification = await schemeClassificationModel.findById(id);
      return classification;
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }

  async updateClassification(id, data) {
    try {
      const result = await schemeClassificationModel.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );
      return result;
    } catch (error) {
      console.error("Error in updateClassification:", error);
      throw error;
    }
  }

  async deleteClassification(id) {
    try {
      const result = await schemeClassificationModel.findByIdAndUpdate(
        id,
        { is_deleted: true },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error("Error in deleteClassification:", error);
      throw error;
    }
  }

  async toggleActiveStatus(id) {
    try {
      const classification = await schemeClassificationModel.findById(id);
      if (!classification) {
        return null;
      }
      const result = await schemeClassificationModel.findByIdAndUpdate(
        id,
        { active: !classification.active },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error("Error in toggleActiveStatus:", error);
      throw error;
    }
  }
}

export default ClassificationRepository;
