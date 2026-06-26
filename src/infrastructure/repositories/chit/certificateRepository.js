import certificateModel from '../../models/chit/certificateModel.js';

class CertificateRepository {
  async findByName(name) {
    try {
      return await certificateModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        isDeleted: false
      });
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while finding certificate by name.");
    }
  }

  async findByCertificateId(certId) {
    try {
      return await certificateModel.findOne({
        id: certId,
        isDeleted: false
      });
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while finding certificate by ID code.");
    }
  }

  async findById(id) {
    try {
      return await certificateModel.findById(id);
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while finding certificate by DB ID.");
    }
  }

  async createCertificate(data) {
    try {
      return await certificateModel.create(data);
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while adding certificate.");
    }
  }

  async editCertificate(id, data) {
    try {
      return await certificateModel.updateOne(
        { _id: id },
        { $set: data }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while editing certificate.");
    }
  }

  async deleteCertificate(id) {
    try {
      return await certificateModel.findByIdAndUpdate(
        id,
        { isDeleted: true, active: false },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while deleting certificate.");
    }
  }

  async toggleActiveState(id, active) {
    try {
      return await certificateModel.findOneAndUpdate(
        { _id: id },
        { active: !active },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while toggling certificate active state.");
    }
  }

  async certificateTableData({ query, skip, limit }) {
    try {
      const data = await certificateModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const totalCount = await certificateModel.countDocuments(query);
      return { data, totalCount };
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while fetching certificates table data.");
    }
  }

  async findAll() {
    try {
      return await certificateModel.find({ isDeleted: false, active: true }).sort({ createdAt: -1 });
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while fetching all certificates.");
    }
  }
}

export default CertificateRepository;
