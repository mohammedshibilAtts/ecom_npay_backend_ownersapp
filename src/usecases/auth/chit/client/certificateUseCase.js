import { isValidObjectId } from "mongoose";

class CertificateUseCase {
  constructor(certificateRepository) {
    this.certificateRepository = certificateRepository;
  }

  async addCertificate(data) {
    try {
      const name = data.name.trim();
      const existsByName = await this.certificateRepository.findByName(name);
      if (existsByName) {
        return { success: false, message: "Certificate name already exists" };
      }

      const existsById = await this.certificateRepository.findByCertificateId(data.id);
      if (existsById) {
        return { success: false, message: "Certificate ID already exists" };
      }

      const savedData = await this.certificateRepository.createCertificate(data);
      if (savedData) {
        return { success: true, message: "Color added successfully" };
      }

      return { success: false, message: "Failed to add certificate" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while adding certificate" };
    }
  }

  async editCertificate(id, data) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object id" };
      }

      const exists = await this.certificateRepository.findById(id);
      if (!exists) {
        return { success: false, message: "Certificate not found" };
      }

      if (data.name) {
        const name = data.name.trim();
        const existsByName = await this.certificateRepository.findByName(name);
        if (existsByName && existsByName._id.toString() !== id) {
          return { success: false, message: "Certificate name already exists" };
        }
      }

      if (data.id !== undefined && data.id !== exists.id) {
        const existsById = await this.certificateRepository.findByCertificateId(data.id);
        if (existsById && existsById._id.toString() !== id) {
          return { success: false, message: "Certificate ID already exists" };
        }
      }

      const updated = await this.certificateRepository.editCertificate(id, data);
      if (updated.modifiedCount === 1) {
        return { success: true, message: "Certificate updated successfully" };
      }

      return { success: false, message: "Failed to update certificate or no changes made" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while editing certificate" };
    }
  }

  async getCertificateById(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Invalid object ID provided" };
      }

      const data = await this.certificateRepository.findById(id);
      if (!data) {
        return { success: false, message: "Certificate not found" };
      }

      return { success: true, message: "Certificate fetched successfully", data };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while fetching certificate" };
    }
  }

  async deleteCertificate(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object id" };
      }

      const deleted = await this.certificateRepository.deleteCertificate(id);
      if (deleted) {
        return { success: true, message: "Certificate deleted successfully" };
      }

      return { success: false, message: "Failed to delete certificate" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while deleting certificate" };
    }
  }

  async toggleActiveState(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Invalid object ID provided" };
      }

      const exists = await this.certificateRepository.findById(id);
      if (!exists) {
        return { success: false, message: "Certificate not found" };
      }

      const updated = await this.certificateRepository.toggleActiveState(id, exists.active);
      if (!updated) {
        return { success: false, message: "Failed to update active status" };
      }

      return {
        success: true,
        message: updated.active
          ? "Certificate has been successfully activated"
          : "Certificate has been successfully deactivated",
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while toggling active status" };
    }
  }

  async certificateTableData(page, limit, search) {
    try {
      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const searchTerm = search || "";

      const query = { isDeleted: false };
      if (searchTerm) {
        query.name = { $regex: searchTerm, $options: "i" };
      }

      const skip = (pageNum - 1) * pageSize;
      const result = await this.certificateRepository.certificateTableData({ query, skip, limit: pageSize });

      return {
        success: true,
        message: "Data fetched successfully",
        data: result.data,
        totalCount: result.totalCount,
        totalPages: Math.ceil(result.totalCount / pageSize),
        currentPage: pageNum,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while fetching table data" };
    }
  }

  async getAllCertificates() {
    try {
      const certificates = await this.certificateRepository.findAll();
      return { success: true, message: "Certificates fetched successfully", data: certificates };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while fetching certificates" };
    }
  }
}

export default CertificateUseCase;
