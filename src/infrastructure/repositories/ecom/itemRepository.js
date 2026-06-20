import mongoose from "mongoose";
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

  async findByProductId({ productId, page, limit, search, sort, order, isMrp }) {
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
          .populate('id_color')
          .populate('id_certificate')
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

      if (isMrp === false && items.length > 0) {
        const purityIds = [...new Set(items.map((item) => item.id_purity?._id?.toString()).filter(Boolean))];

        if (purityIds.length > 0) {
          const metalRateModel = mongoose.model("MetalRate");

          const latestRates = await metalRateModel.aggregate([
            { $match: { purity_id: { $in: purityIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$purity_id", rate: { $first: "$rate" } } }
          ]);

          const rateMap = latestRates.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.rate;
            return acc;
          }, {});

          items.forEach((item) => {
            const pid = item.id_purity?._id?.toString();
            if (pid && rateMap[pid] && item.status !== 2) {
              item.currentMetalRate = rateMap[pid];
            }
          });
        }
      }

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
    const item = await itemModel.findById(id).populate({
      path: "stoneDetails",
      populate: { path: "itemId" }
    })
      .populate("id_purity")
      .populate("id_color")
      .populate("id_certificate");

    if (item && item.productId && item.id_purity) {
      const [product, latestRate] = await Promise.all([
        mongoose.model("Product").findById(item.productId).select("isMrp").lean(),
        mongoose.model("MetalRate")
          .findOne({ purity_id: item.id_purity._id })
          .sort({ createdAt: -1 })
          .select("rate")
          .lean()
      ]);

      if (product && product.isMrp === false && latestRate) {
        item.currentMetalRate = latestRate.rate;
      }
    }

    return item;
  }

  async findFirstByProductId(productId) {
    const item = await itemModel
      .findOne({ productId: new mongoose.Types.ObjectId(productId), is_deleted: { $ne: true } })
      .sort({ createdAt: 1 })
      .populate({ path: "stoneDetails", populate: { path: "itemId" } })
      .populate("id_purity")
      .populate("id_color")
      .populate("id_certificate");

    if (item && item.id_purity) {
      const [product, latestRate] = await Promise.all([
        mongoose.model("Product").findById(item.productId).select("isMrp").lean(),
        mongoose.model("MetalRate")
          .findOne({ purity_id: item.id_purity._id })
          .sort({ createdAt: -1 })
          .select("rate")
          .lean()
      ]);

      if (product && product.isMrp === false && latestRate) {
        item.currentMetalRate = latestRate.rate;
      }
    }

    return item;
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

  async getSizesByPurity(productId, purityId) {
    try {
      const items = await itemModel
        .find({
          productId: productId,
          id_purity: purityId,
          active: true,
          is_deleted: { $ne: true },
        })
        .populate("size")
        .lean();

      const uniqueSizes = [];
      const seenSizeKeys = new Set();

      for (const item of items) {
        const sizeKey = `${item.size?._id?.toString()}_${item.sizeValue}`;
        if (item.size && !seenSizeKeys.has(sizeKey)) {
          seenSizeKeys.add(sizeKey);
          uniqueSizes.push({
            sizeId: item.size._id,
            sizeValue: item.sizeValue,
            unit: item.unit,
          });
        }
      }

      uniqueSizes.sort((a, b) => Number(a.sizeValue) - Number(b.sizeValue));

      return uniqueSizes;
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (getSizesByPurity): ${error.message}`);
    }
  }

  async getItemsByCriteria(productId, sizeValue, purityId) {
    try {
      const [items, product, latestRate] = await Promise.all([
        itemModel
          .find({
            productId: productId,
            sizeValue: sizeValue,
            id_purity: purityId,
            active: true,
            is_deleted: { $ne: true },
          })
          .populate("stoneDetails size")
          .lean(),
        mongoose.model("Product").findById(productId).select("isMrp").lean(),
        mongoose.model("MetalRate")
          .findOne({ purity_id: purityId })
          .sort({ createdAt: -1 })
          .select("rate")
          .lean(),
      ]);

      if (items.length > 0 && product && product.isMrp === false && latestRate) {
        items.forEach((item) => {
          item.currentMetalRate = latestRate.rate;
        });
      }

      return items;
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (getItemsByCriteria): ${error.message}`);
    }
  }
}

export default ItemRepository;
