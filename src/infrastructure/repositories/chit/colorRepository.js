import colorModel from '../../models/chit/colorModel.js';

class ColorRepository {
  async findByName(name) {
    try {
      return await colorModel.findOne({
        color: { $regex: new RegExp(`^${name}$`, 'i') },
        isDeleted: false
      });
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while finding color by name.");
    }
  }

  async findByCode(code) {
    try {
      return await colorModel.findOne({
        code,
        isDeleted: false
      });
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while finding color by code.");
    }
  }

  async findById(id) {
    try {
      return await colorModel.findById(id);
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while finding color by ID.");
    }
  }

  async createColor(data) {
    try {
      return await colorModel.create(data);
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while adding color.");
    }
  }

  async editColor(id, data) {
    try {
      return await colorModel.updateOne(
        { _id: id },
        { $set: data }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while editing color.");
    }
  }

  async deleteColor(id) {
    try {
      return await colorModel.findByIdAndUpdate(
        id,
        { isDeleted: true, active: false },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while deleting color.");
    }
  }

  async toggleActiveState(id, active) {
    try {
      return await colorModel.findOneAndUpdate(
        { _id: id },
        { active: !active },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while toggling color active state.");
    }
  }

  async colorTableData({ query, skip, limit }) {
    try {
      const data = await colorModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const totalCount = await colorModel.countDocuments(query);
      return { data, totalCount };
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while fetching colors table data.");
    }
  }

  async findAll() {
    try {
      return await colorModel.find({ isDeleted: false, active: true }).sort({ createdAt: -1 });
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while fetching all colors.");
    }
  }
}

export default ColorRepository;
