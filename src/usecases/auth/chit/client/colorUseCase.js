import { isValidObjectId } from "mongoose";

class ColorUseCase {
  constructor(colorRepository) {
    this.colorRepository = colorRepository;
  }

  async addColor(data) {
    try {
      const colorName = data.color.trim();
      const existsByName = await this.colorRepository.findByName(colorName);
      if (existsByName) {
        return { success: false, message: "Color name already exists" };
      }

      const existsByCode = await this.colorRepository.findByCode(data.code);
      if (existsByCode) {
        return { success: false, message: "Color code already exists" };
      }

      const savedData = await this.colorRepository.createColor(data);
      if (savedData) {
        return { success: true, message: "Color added successfully" };
      }

      return { success: false, message: "Failed to add color" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while adding color" };
    }
  }

  async editColor(id, data) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object id" };
      }

      const exists = await this.colorRepository.findById(id);
      if (!exists) {
        return { success: false, message: "Color not found" };
      }

      if (data.color) {
        const colorName = data.color.trim();
        const existsByName = await this.colorRepository.findByName(colorName);
        if (existsByName && existsByName._id.toString() !== id) {
          return { success: false, message: "Color name already exists" };
        }
      }

      if (data.code !== undefined && data.code !== exists.code) {
        const existsByCode = await this.colorRepository.findByCode(data.code);
        if (existsByCode && existsByCode._id.toString() !== id) {
          return { success: false, message: "Color code already exists" };
        }
      }

      const updated = await this.colorRepository.editColor(id, data);
      if (updated.modifiedCount === 1) {
        return { success: true, message: "Color updated successfully" };
      }

      return { success: false, message: "Failed to update color or no changes made" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while editing color" };
    }
  }

  async getColorById(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Invalid object ID provided" };
      }

      const data = await this.colorRepository.findById(id);
      if (!data) {
        return { success: false, message: "Color not found" };
      }

      return { success: true, message: "Color fetched successfully", data };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while fetching color" };
    }
  }

  async deleteColor(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object id" };
      }

      const deleted = await this.colorRepository.deleteColor(id);
      if (deleted) {
        return { success: true, message: "Color deleted successfully" };
      }

      return { success: false, message: "Failed to delete color" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while deleting color" };
    }
  }

  async toggleColorActiveState(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Invalid object ID provided" };
      }

      const exists = await this.colorRepository.findById(id);
      if (!exists) {
        return { success: false, message: "Color not found" };
      }

      const updated = await this.colorRepository.toggleActiveState(id, exists.active);
      if (!updated) {
        return { success: false, message: "Failed to update active status" };
      }

      return {
        success: true,
        message: updated.active
          ? "Color has been successfully activated"
          : "Color has been successfully deactivated",
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while toggling active status" };
    }
  }

  async colorTableData(page, limit, search) {
    try {
      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const searchTerm = search || "";

      const query = { isDeleted: false };
      if (searchTerm) {
        query.color = { $regex: searchTerm, $options: "i" };
      }

      const skip = (pageNum - 1) * pageSize;
      const result = await this.colorRepository.colorTableData({ query, skip, limit: pageSize });

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

  async getAllColors() {
    try {
      const colors = await this.colorRepository.findAll();
      return { success: true, message: "Colors fetched successfully", data: colors };
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while fetching colors" };
    }
  }
}

export default ColorUseCase;
