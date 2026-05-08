import mongoose from "mongoose";
import stoneDetialsModel from "../../models/ecom/stoneDetialsModel.js";
import productModel from "../../models/chit/productModel.js";

class StoneDetailsRepository {
  async create(data) {
    try {
      const savedData = await stoneDetialsModel.create(data);
      return savedData;
    } catch (error) {
      console.error("Error in StoneDetailsRepository.create:", error);
      throw error;
    }
  }

  async createMany(dataArray) {
    try {
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error("createMany requires a non-empty array of data");
      }

      const savedData = await stoneDetialsModel.insertMany(dataArray, {
        ordered: false,
      });
      return savedData;
    } catch (error) {
      console.error("Error in StoneDetailsRepository.createMany:", error);
      throw error;
    }
  }

async updateStoneDetails(productId, newStoneDetailsArray) {
  try {
    // Ensure array
    if (!Array.isArray(newStoneDetailsArray)) {
      throw new Error("Stone details should be an array");
    }

    // 1️⃣ Find product
    const product = await productModel.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // 2️⃣ Delete old stone details
    if (product.stoneDetails.length > 0) {
      await stoneDetialsModel.deleteMany({
        _id: { $in: product.stoneDetails }
      });
    }

    // 3️⃣ If frontend sent empty list → clear product.stoneDetails
    if (newStoneDetailsArray.length === 0) {
      product.stoneDetails = [];
      await product.save();
      return [];
    }

    // 4️⃣ Insert new stone details (no need to pass productId)
    const savedStones = await stoneDetialsModel.insertMany(newStoneDetailsArray, {
      ordered: false
    });

    // 5️⃣ Update product with new IDs
    product.stoneDetails = savedStones.map(stone => stone._id);

    await product.save();

    return savedStones;

  } catch (error) {
    console.error("Error in updateStoneDetails:", error);
    throw error;
  }
}



  async getById(id) {
    try {
      const stone = await stoneDetialsModel.findById(id)
      .populate('itemId')
      return stone;
    } catch (error) {
      console.error("Error in StoneDetailsRepository.getById:", error);
      throw error;
    }
  }

 async getManyByIds(ids, type) {
    try {
      const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

      const results = await stoneDetialsModel.find({
        _id: { $in: objectIds },
        type: type, 
      }).populate("itemId"); 

      return { type, data: results };
    } catch (error) {
      console.error("Error in getManyByIds:", error);
      throw error;
    }
  }





}

export default StoneDetailsRepository;
