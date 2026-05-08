import itemModel from "../../models/ecom/itemModel.js";

class ItemRepository {
  async bulkCreate(items) {
    try {
      return await itemModel.insertMany(items);
    } catch (error) {
      throw new Error(`Repository Error (bulkCreate): ${error.message}`);
    }
  }

  async findExistingTags(tagNumbers) {
    return await itemModel.find({
      tagNo: { $in: tagNumbers },
    });
  }

  async findByProductId({ productId, page, limit, search, sort, order }) {
    try {
      const query = {
        productId,
        is_deleted: { $ne: true },
      };

      // 🔎 Tag Search
      if (search) {
        query.tagNo = { $regex: search, $options: "i" };
      }

      const skip = (page - 1) * limit;

      const sortOrder = order === "asc" ? 1 : -1;

      const [items, total] = await Promise.all([
        itemModel
          .find(query)
          .populate('id_purity')
          .populate({
            path: "stoneDetails",
            populate: { path: "itemId" }
          })
          .sort({ [sort]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean(),

        itemModel.countDocuments(query),
      ]);

      return {
        data: items,
        pagination: {
          totalItems: total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          pageSize: limit,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (findByProductId): ${error.message}`);
    }
  }

  async findByTag(tagNo) {
    return await itemModel.findOne({ tagNo });
  }

  async findById(id) {
    return await itemModel.findById(id);
  }

  async updateStatus(id, status) {
    return await itemModel.findByIdAndUpdate(
      id,
      { active: status },
      { new: true },
    );
  }

  async updateItem(id, updateData) {
    return await itemModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
  }
}

export default ItemRepository;
