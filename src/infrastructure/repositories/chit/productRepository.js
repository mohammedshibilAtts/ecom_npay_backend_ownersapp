import ProductModel from "../../models/chit/productModel.js";
import mongoose from "mongoose";
import config from "../../../config/chit/env.js";
import { getPricingPipeline } from "../ecom/helpers/pricingPipeline.js";

class ProductRepository {
  async findByName(product_name, id_branch, id) {
    try {
      const filter = {
        product_name: product_name,
        is_deleted: false,
        id_branch: id_branch,
      };
      if (id) filter._id = { $ne: id };
      const findProduct = await ProductModel.findOne(filter);
      if (!findProduct) return null;
      return {
        product_name: findProduct.product_name,
        _id: findProduct._id,
      };
    } catch (err) {
      throw new Error("Database error finding product by name");
    }
  }

  async findByField(query) {
    try {
      return await ProductModel.findOne(query);
    } catch (err) {
      throw new Error("Database error finding product by field");
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new ProductModel(productData);
      return await newProduct.save();
    } catch (err) {
      console.error("Repository error:", err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metalDetails",
          },
        },
        {
          $lookup: {
            from: "branches",
            localField: "id_branch",
            foreignField: "_id",
            as: "branchDetails",
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoryDetails",
          },
        },
        {
           $lookup: {
             from: "s3bucketsettings",
             pipeline: [{ $limit: 1 }],
             as: "s3Details",
           },
        },
        { $unwind: { path: "$s3Details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "metalrates",
            let: { metalId: "$id_metal", branchId: "$id_branch" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$material_type_id", "$$metalId"] },
                      { $eq: ["$id_branch", "$$branchId"] }
                    ]
                  }
                }
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 }
            ],
            as: "metalRateInfo"
          }
        },
        {
          $lookup: {
            from: "items",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$productId", "$$productId"] },
                      { $eq: ["$active", true] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        // Inject Reusable Pricing Pipeline for the firstItem
        ...getPricingPipeline("$id_branch").map(stage => {
          // Adjust stages to work on the firstItem object
          if (stage.$lookup && stage.$lookup.from === "metalrates") {
             stage.$lookup.let = { purityId: "$firstItem.id_purity", bId: "$id_branch" };
             stage.$lookup.pipeline[0].$match.$expr.$and[0].$eq[1] = "$$purityId";
             stage.$lookup.pipeline[0].$match.$expr.$and[1].$eq[1] = "$$bId";
          }
          return stage;
        }),
        {
          $project: {
            _id: 1,
            id_category: 1,
            id_branch: 1,
            id_metal: 1,
            product_name: 1,
            description: 1,
            code: 1,
            gst: 1,
            product_image: 1,
            showprice: 1,
            isMrp: 1,
            subcategoryId: 1,
            sizeId: 1,
            sku: 1,
            bestSeller: 1,
            active: 1,
            onlineProduct: 1,
            collection: 1,
            createdAt: 1,
            updatedAt: 1,
            price: "$calculatedPrice",
            totalprice: "$calculatedTotalPrice",
            categoryName: "$categoryDetails.category_name",
            metalName: { $arrayElemAt: ["$metalDetails.metal_name", 0] },
            pathurl: {
              $concat: [
                { $ifNull: ["$s3Details.s3display_url", ""] },
                `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
              ],
            },
          }
        }
      ];

      const result = await ProductModel.aggregate(pipeline);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      console.error(err);
      throw new Error("Database error finding product by ID via aggregation");
    }
  }

  async countProduct(filter) {
    try {
      return await ProductModel.countDocuments(filter);
    } catch (err) {
      throw new Error("Database error counting products");
    }
  }

  async getProducts(filter, skip, limit, searchOptions, customerId = null) {
    try {
      const pipeline = [
        { $match: filter },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "branches",
            localField: "id_branch",
            foreignField: "_id",
            as: "id_branch",
          },
        },
        { $unwind: { path: "$id_branch", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "id_category",
          },
        },
        { $unwind: { path: "$id_category", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "id_metal",
          },
        },
        { $unwind: { path: "$id_metal", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "sizemasters",
            localField: "sizeId",
            foreignField: "_id",
            as: "sizeDetails",
          },
        },
        { $unwind: { path: "$sizeDetails", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "s3bucketsettings",
            pipeline: [{ $limit: 1 }],
            as: "s3Details",
          },
        },
        { $unwind: { path: "$s3Details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$productId", "$$productId"] },
                      { $eq: ["$active", true] },
                    ],
                  },
                },
              },
              { $count: "stockCount" },
            ],
            as: "stockData",
          },
        },
        {
          $lookup: {
            from: "items",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$productId", "$$productId"] },
                      { $eq: ["$active", true] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        ...getPricingPipeline("$id_branch").map(stage => {
           if (stage.$lookup && stage.$lookup.from === "metalrates") {
              stage.$lookup.let = { purityId: "$firstItem.id_purity", bId: "$id_branch" };
              stage.$lookup.pipeline[0].$match.$expr.$and[0].$eq[1] = "$$purityId";
              stage.$lookup.pipeline[0].$match.$expr.$and[1].$eq[1] = "$$bId";
           }
           return stage;
        }),
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            product_name: 1,
            createdAt: 1,
            product_image: 1,
            active: 1,
            bestSeller: 1,
            price: "$calculatedPrice",
            totalprice: "$calculatedTotalPrice",
            branchName: "$id_branch.branch_name",
            metalName: "$id_metal.metal_name",
            categoryName: "$id_category.category_name",
            stock: { $ifNull: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0] },
            onlineProduct: 1,
            pathurl: {
              $concat: [
                { $ifNull: ["$s3Details.s3display_url", ""] },
                `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
              ],
            },
          },
        },
      ];

      return await ProductModel.aggregate(pipeline);
    } catch (err) {
      console.error(err);
      throw new Error("Database error getting products via aggregation");
    }
  }

  async deleteProduct(id) {
    try {
      return await ProductModel.findByIdAndUpdate(id, { is_deleted: true });
    } catch (err) {
      throw new Error("Database error deleting product");
    }
  }

  async updateProduct(id, updateData) {
    try {
      return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (err) {
      throw new Error("Database error updating product");
    }
  }

  async editProduct(updateFields, id) {
    try {
      return await ProductModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    } catch (err) {
      throw new Error("Database error editing product");
    }
  }

  async getCategoryByCollectionId(id) {
    try {
      const products = await ProductModel.find({ collection: id, is_deleted: false });
      const categoryIds = [...new Set(products.map(p => p.id_category.toString()))];
      return await mongoose.model("Category").find({ _id: { $in: categoryIds } });
    } catch (err) {
      throw new Error("Database error fetching categories by collection");
    }
  }

  async getProductBySubcategory(id, page, limit, filter) {
    try {
      const skip = (page - 1) * limit;
      const pipeline = [
        {
          $match: {
            subcategoryId: new mongoose.Types.ObjectId(id),
            is_deleted: false,
            active: true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metalDetails",
          },
        },
        {
          $lookup: {
            from: "s3bucketsettings",
            pipeline: [{ $limit: 1 }],
            as: "s3Details",
          },
        },
        { $unwind: { path: "$s3Details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$productId", "$$productId"] },
                      { $eq: ["$active", true] },
                    ],
                  },
                },
              },
              { $count: "stockCount" },
            ],
            as: "stockData",
          },
        },
        {
          $lookup: {
            from: "items",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$productId", "$$productId"] },
                      { $eq: ["$active", true] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        ...getPricingPipeline("$id_branch").map(stage => {
          if (stage.$lookup && stage.$lookup.from === "metalrates") {
             stage.$lookup.let = { purityId: "$firstItem.id_purity", bId: "$id_branch" };
             stage.$lookup.pipeline[0].$match.$expr.$and[0].$eq[1] = "$$purityId";
             stage.$lookup.pipeline[0].$match.$expr.$and[1].$eq[1] = "$$bId";
          }
          return stage;
        }),
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $skip: skip },
              { $limit: parseInt(limit) },
              {
                $project: {
                  _id: 1,
                  product_name: 1,
                  product_image: 1,
                  createdAt: 1,
                  bestSeller: 1,
                  price: "$calculatedPrice",
                  totalprice: "$calculatedTotalPrice",
                  categoryName: { $arrayElemAt: ["$categoryDetails.category_name", 0] },
                  stock: { $ifNull: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0] },
                  pathurl: {
                    $concat: [
                      { $ifNull: ["$s3Details.s3display_url", ""] },
                      `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
                    ],
                  },
                },
              },
            ],
          },
        },
      ];

      const result = await ProductModel.aggregate(pipeline);
      const total = result[0].metadata[0]?.total || 0;
      const products = result[0].data;

      return {
        products,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDocs: total,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Database error fetching products by subcategory via aggregation");
    }
  }

  async getProductByCategory(id, page, limit, filter) {
    try {
      const skip = (page - 1) * limit;
      const query = { id_category: id, is_deleted: false };
      const products = await ProductModel.find(query)
        .populate("id_category id_metal id_branch subcategoryId sizeId")
        .skip(skip)
        .limit(limit);
      const total = await ProductModel.countDocuments(query);
      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (err) {
      throw new Error("Database error fetching products by category");
    }
  }

  async getProductStockReport(page, limit, filters) {
    try {
      const skip = (page - 1) * limit;
      const query = { is_deleted: false };
      const data = await ProductModel.find(query)
        .populate("id_category id_metal id_branch subcategoryId sizeId")
        .skip(skip)
        .limit(limit);
      const total = await ProductModel.countDocuments(query);
      return {
        data,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (err) {
      throw new Error("Database error fetching stock report");
    }
  }

  async findByBranchId(id) {
    try {
      return await ProductModel.find({ id_branch: id, is_deleted: false }).populate(
        "id_category id_metal id_branch subcategoryId sizeId"
      );
    } catch (err) {
      throw new Error("Database error finding products by branch ID");
    }
  }
}

export default ProductRepository;
