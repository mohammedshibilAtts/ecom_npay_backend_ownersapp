import ProductModel from "../../models/chit/productModel.js";
import mongoose from "mongoose";
import config from "../../../config/chit/env.js";
import { getPricingPipeline } from "../ecom/helpers/pricingPipeline.js";
import { getS3DisplayUrl } from "../ecom/helpers/s3Cache.js";

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

  async findById(id, customerId = null, change) {
    try {
      const s3Url = await getS3DisplayUrl();
      const pipeline = [
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metalDetails",
          },
        },
        { $unwind: { path: "$metalDetails", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "purities",
            let: { metalId: "$id_metal", productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$id_metal", "$$metalId"] },
                      { $eq: ["$active", true] },
                      { $ne: ["$is_deleted", true] }
                    ]
                  }
                }
              },
              {
                $lookup: {
                  from: "items",
                  let: { purityId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$productId", "$$productId"] },
                            { $eq: ["$id_purity", "$$purityId"] },
                            ...(change ? [] : [{ $eq: ["$active", true] }]),
                            { $ne: ["$is_deleted", true] }
                          ]
                        }
                      }
                    },
                    { $limit: 1 }
                  ],
                  as: "hasItem"
                }
              },
              { $match: { "hasItem.0": { $exists: true } } },
              { $project: { hasItem: 0 } }
            ],
            as: "purityList"
          }
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
        { $addFields: { s3DisplayUrl: s3Url } },
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
                      ...(change ? [] : [{ $eq: ["$active", true] }]),
                      { $ne: ["$is_deleted", true] }
                    ],
                  },
                },
              },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
              {
                $lookup: {
                  from: "purities",
                  let: { pId: "$id_purity" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: [
                            "$_id",
                            { $convert: { input: "$$pId", to: "objectId", onError: "$$pId", onNull: "$$pId" } }
                          ]
                        }
                      }
                    }
                  ],
                  as: "purityDetails",
                },
              },
              { $unwind: { path: "$purityDetails", preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: "stonedetails",
                  localField: "stoneDetails",
                  foreignField: "_id",
                  as: "stoneDetails",
                  pipeline: [
                    {
                      $lookup: {
                        from: "stone_masters",
                        localField: "itemId",
                        foreignField: "_id",
                        as: "itemId"
                      }
                    },
                    { $unwind: { path: "$itemId", preserveNullAndEmptyArrays: true } }
                  ]
                }
              },
              {
                $addFields: {
                  purityName: "$purityDetails.purity_name",
                },
              },
              { $project: { purityDetails: 0 } },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        ...getPricingPipeline("$id_branch", "firstItem")
      ];

      if (change) {
        pipeline.unshift(
          {
            $match: {
              _id: new mongoose.Types.ObjectId(id),
              is_deleted: false
            },
          }
        )
      } else {
        pipeline.unshift(
          {
            $match: {
              _id: new mongoose.Types.ObjectId(id),
              is_deleted: false,
              active: true
            },
          }
        )
      }

      if (customerId) {
        pipeline.push({
          $lookup: {
            from: "wishlists",
            let: { pId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$itemId", "$$pId"] },
                      { $eq: ["$id_customer", new mongoose.Types.ObjectId(customerId)] }
                    ]
                  }
                }
              }
            ],
            as: "wishlistData"
          }
        });
      }

      pipeline.push({
        $addFields: {
          categoryNameRoot: "$categoryDetails.category_name",
          stoneValue: "$totalStoneValue",
          gstValue: "$gstAmount",
        }
      });

      pipeline.push({
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
          makingCharges: 1,
          wastageCharges: 1,
          collection: 1,
          createdAt: 1,
          updatedAt: 1,
          categoryName: "$categoryNameRoot",
          metalName: "$metalDetails.metal_name",
          latestMetalPrice: { $ifNull: [{ $arrayElemAt: ["$metalRateInfo.rate", 0] }, 0] },
          price: "$calculatedPrice",
          totalprice: "$calculatedTotalPrice",
          totalAmount: "$calculatedPrice", // Alias for OrderUseCase
          discountedAmount: "$calculatedPrice", // Alias for OrderUseCase
          id_purity: "$firstItem.id_purity",
          purityName: 1,
          metalValue: 1,
          makingValue: 1,
          wastageValue: 1,
          stoneValue: 1,
          gstValue: 1,
          firstItem: 1,
          huid: 1,
          huidCharges: 1,
          showHuidCharge: 1,
          showHuidNo: 1,
          isWishlisted: customerId ? { $gt: [{ $size: { $ifNull: ["$wishlistData", []] } }, 0] } : { $literal: false },
          purityList: {
            $map: {
              input: { $ifNull: ["$purityList", []] },
              as: "p",
              in: { _id: "$$p._id", purity_name: "$$p.purity_name" }
            }
          },
          pathurl: {
            $concat: [
              { $ifNull: ["$s3DisplayUrl", ""] },
              `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
            ],
          },
        }
      });

      const result = await ProductModel.aggregate(pipeline);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      console.error(err);
      throw new Error("Database error finding product by ID via aggregation");
    }
  }

  async countProduct(filter, searchOptions = null, web) {
    try {
      const isWeb = web === true || web === "true";
      if (isWeb && (!searchOptions || !searchOptions.term)) {
        return await ProductModel.countDocuments(filter);
      }

      const searchRegex = searchOptions && searchOptions.term ? new RegExp(searchOptions.term, "i") : null;
      const pipeline = [
        { $match: filter },
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
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "id_subcategory",
          },
        },
        { $unwind: { path: "$id_subcategory", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "id_metal",
          },
        },
        { $unwind: { path: "$id_metal", preserveNullAndEmptyArrays: true } },
        ...(!isWeb
          ? [
            {
              $match: {
                "id_category.active": { $ne: false },
                "id_subcategory.active": { $ne: false },
              },
            },
          ]
          : []),
        ...(searchRegex
          ? [
            {
              $match: {
                $or: [
                  { product_name: { $regex: searchRegex } },
                  { sku: { $regex: searchRegex } },
                  { "id_category.category_name": { $regex: searchRegex } },
                  { "id_subcategory.name": { $regex: searchRegex } },
                  { "id_metal.metal_name": { $regex: searchRegex } },
                ],
              },
            },
          ]
          : []),
        { $count: "total" }
      ];

      const result = await ProductModel.aggregate(pipeline);
      return result.length > 0 ? result[0].total : 0;
    } catch (err) {
      console.error(err);
      throw new Error("Database error counting products");
    }
  }

  async getProducts(filter, skip, limit, searchOptions, customerId = null, web) {
    try {
      const s3Url = await getS3DisplayUrl();
      const isWeb = web === true || web === "true";

      const pipeline = [
        { $match: filter },
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
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "id_subcategory",
          },
        },
        { $unwind: { path: "$id_subcategory", preserveNullAndEmptyArrays: true } },
        ...(!isWeb
          ? [
            {
              $match: {
                "id_category.active": { $ne: false },
                "id_subcategory.active": { $ne: false },
              },
            },
          ]
          : []),
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
        { $addFields: { s3DisplayUrl: s3Url } },
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
                      { $ne: ["$is_deleted", true] },
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
                      { $eq: ["$status", 2] },
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ],
            as: "soldItems",
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
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
              { $sort: { netWeight: 1 } },
              { $limit: 1 },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        ...(isWeb ? [] : getPricingPipeline("$id_branch._id", "firstItem")),
        ...(searchOptions && searchOptions.term
          ? [
            {
              $match: {
                $or: [
                  { product_name: { $regex: new RegExp(searchOptions.term, "i") } },
                  { sku: { $regex: new RegExp(searchOptions.term, "i") } },
                  { "id_category.category_name": { $regex: new RegExp(searchOptions.term, "i") } },
                  { "id_subcategory.name": { $regex: new RegExp(searchOptions.term, "i") } },
                  { "id_metal.metal_name": { $regex: new RegExp(searchOptions.term, "i") } },
                ],
              },
            },
          ]
          : []),
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  product_name: 1,
                  createdAt: 1,
                  product_image: 1,
                  active: 1,
                  bestSeller: 1,
                  price: { $ifNull: ["$calculatedPrice", 0] },
                  totalprice: { $ifNull: ["$calculatedTotalPrice", 0] },
                  branchName: "$id_branch.branch_name",
                  metalName: "$id_metal.metal_name",
                  categoryName: "$id_category.category_name",
                  subcategoryName: "$id_subcategory.name",
                  stock: { $ifNull: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0] },
                  sold: {
                    $cond: {
                      if: { $gt: [{ $size: { $ifNull: ["$soldItems", []] } }, 0] },
                      then: false,
                      else: true,
                    },
                  },
                  onlineProduct: 1,
                  pathurl: {
                    $concat: [
                      { $ifNull: ["$s3DisplayUrl", ""] },
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
      const total = result[0]?.metadata[0]?.total || 0;
      const data = result[0]?.data || [];

      return { data, total };
    } catch (err) {
      console.error(err);
      throw new Error("Database error getting products via aggregation");
    }
  }

  async getSearchSuggestions(filter, searchOptions) {
    try {
      const s3Url = await getS3DisplayUrl();

      const pipeline = [
        { $match: filter },
        {
          $match: {
            $or: [
              { product_name: { $regex: new RegExp(searchOptions.term, "i") } },
              { sku: { $regex: new RegExp(searchOptions.term, "i") } },
            ],
          },
        },
        { $limit: 10 },
        {
          $project: {
            _id: 1,
            product_name: 1,
            // sku: 1,
            // pathurl: {
            //   $concat: [
            //     { $ifNull: [s3Url, ""] },
            //     `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
            //   ],
            // },
            // product_image: { $arrayElemAt: ["$product_image", 0] }
          }
        }
      ];

      return await ProductModel.aggregate(pipeline);
    } catch (err) {
      console.error("Database error getting search suggestions:", err);
      return [];
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

  async toggleItemSoldStatus(productId) {
    try {
      const ItemModel = mongoose.model("Item");
      const item = await ItemModel.findOne({ productId: new mongoose.Types.ObjectId(productId), is_deleted: { $ne: true } });
      if (!item) {
        throw new Error("Item not found for this product");
      }
      const newStatus = item.status === 1 ? 2 : 1;
      const newActive = newStatus === 1;
      item.status = newStatus;
      item.active = newActive;
      await item.save();
      return item;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Database error toggling item sold status");
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
      return await ProductModel.aggregate([
        { $match: { collection: new mongoose.Types.ObjectId(id), active: true, is_deleted: false } },
        { $group: { _id: "$id_category" } },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
        { $unwind: "$cat" },
        { $match: { "cat.active": true, "cat.is_deleted": false } },
        { $replaceRoot: { newRoot: "$cat" } }
      ]);
    } catch (err) {
      throw new Error("Database error fetching categories by collection");
    }
  }

  async getProductBySubcategory(id, page, limit, filter, customerId = null) {
    try {
      const s3Url = await getS3DisplayUrl();
      const skip = (page - 1) * limit;
      const match = {
        subcategoryId: new mongoose.Types.ObjectId(id),
        is_deleted: false,
        active: true,
      };

      if (filter.from_date && filter.to_date) {
        match.createdAt = {
          $gte: new Date(filter.from_date),
          $lte: new Date(filter.to_date),
        };
      }

      const sortValue = {};
      if (filter.sort === "latest") {
        sortValue.createdAt = -1;
      } else if (filter.sort === "price_lth") {
        sortValue.calculatedTotalPrice = 1;
      } else if (filter.sort === "price_htl") {
        sortValue.calculatedTotalPrice = -1;
      } else {
        sortValue.createdAt = -1;
      }

      const pipeline = [
        {
          $match: match,
        },
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metalDetails",
          },
        },
        { $unwind: { path: "$metalDetails", preserveNullAndEmptyArrays: true } },
        { $addFields: { s3DisplayUrl: s3Url } },
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
                      { $eq: ["$status", 1] },
                      { $ne: ["$is_deleted", true] },
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
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
              {
                $lookup: {
                  from: "stonedetails",
                  localField: "stoneDetails",
                  foreignField: "_id",
                  as: "stoneDetails",
                  pipeline: [
                    {
                      $lookup: {
                        from: "stone_masters",
                        localField: "itemId",
                        foreignField: "_id",
                        as: "itemId"
                      }
                    },
                    { $unwind: { path: "$itemId", preserveNullAndEmptyArrays: true } }
                  ]
                }
              },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: false } },
        { $addFields: { s3DisplayUrl: s3Url } },
        ...getPricingPipeline("$id_branch", "firstItem")
      ];

      if (customerId) {
        pipeline.push({
          $lookup: {
            from: "wishlists",
            let: { pId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$itemId", "$$pId"] },
                      { $eq: ["$id_customer", new mongoose.Types.ObjectId(customerId)] }
                    ]
                  }
                }
              }
            ],
            as: "wishlistData"
          }
        });
      }

      pipeline.push({ $sort: sortValue });
      pipeline.push({
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
                bestSeller: 1,
                meta: 1,
                metalrate: 1,
                price: "$calculatedPrice",
                totalprice: "$calculatedTotalPrice",
                categoryName: "$categoryDetails.category_name",
                metalName: "$metalDetails.metal_name",
                stock: { $ifNull: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0] },
                isWishlisted: customerId ? { $gt: [{ $size: { $ifNull: ["$wishlistData", []] } }, 0] } : { $literal: false },
                pathurl: {
                  $concat: [
                    { $ifNull: ["$s3DisplayUrl", ""] },
                    `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
                  ],
                },
              },
            },
          ],
        },
      });

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

  async getProductByCategory(id, page, limit, filter, customerId = null) {
    try {
      const s3Url = await getS3DisplayUrl();
      const skip = (page - 1) * limit;
      const match = {
        id_category: new mongoose.Types.ObjectId(id),
        is_deleted: false,
        active: true,
      };

      if (filter.from_date && filter.to_date) {
        match.createdAt = {
          $gte: new Date(filter.from_date),
          $lte: new Date(filter.to_date),
        };
      }

      const sortValue = {};
      if (filter.sort === "latest") {
        sortValue.createdAt = -1;
      } else if (filter.sort === "price_lth") {
        sortValue.calculatedTotalPrice = 1;
      } else if (filter.sort === "price_htl") {
        sortValue.calculatedTotalPrice = -1;
      } else {
        sortValue.createdAt = -1;
      }

      const pipeline = [
        {
          $match: match,
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoryDetails"
          }
        },
        { $unwind: { path: "$subcategoryDetails", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            "subcategoryDetails.active": { $ne: false }
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
                      { $eq: ["$status", 1] },
                      { $ne: ["$is_deleted", true] },
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
                      { $eq: ["$status", 1] },
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: 1 } },
              { $limit: 1 },
              {
                $lookup: {
                  from: "stonedetails",
                  localField: "stoneDetails",
                  foreignField: "_id",
                  as: "stoneDetails",
                  pipeline: [
                    {
                      $lookup: {
                        from: "stone_masters",
                        localField: "itemId",
                        foreignField: "_id",
                        as: "itemId"
                      }
                    },
                    { $unwind: { path: "$itemId", preserveNullAndEmptyArrays: true } }
                  ]
                }
              },
            ],
            as: "firstItem",
          },
        },
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: false } },
        { $addFields: { s3DisplayUrl: s3Url } },
        ...getPricingPipeline("$id_branch", "firstItem")
      ];

      if (customerId) {
        pipeline.push({
          $lookup: {
            from: "wishlists",
            let: { pId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$itemId", "$$pId"] },
                      { $eq: ["$id_customer", new mongoose.Types.ObjectId(customerId)] }
                    ]
                  }
                }
              }
            ],
            as: "wishlistData"
          }
        });
      }

      pipeline.push({ $sort: sortValue });
      pipeline.push({
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
                bestSeller: 1,
                isWishlisted: {
                  $cond: [
                    { $gt: [{ $size: { $ifNull: ["$wishlistData", []] } }, 0] },
                    true,
                    false
                  ]
                },
                price: "$calculatedPrice",
                totalprice: "$calculatedTotalPrice",
                stockStatus: {
                  $cond: [
                    { $gt: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0] },
                    "In Stock",
                    "Out of Stock"
                  ]
                },
                pathurl: {
                  $concat: [
                    { $ifNull: ["$s3DisplayUrl", ""] },
                    `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
                  ],
                },
              }
            }
          ]
        }
      });

      const result = await ProductModel.aggregate(pipeline);
      const products = result[0].data;
      const total = result[0].metadata[0]?.total || 0;

      return {
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        }
      };
    } catch (err) {
      console.error(err);
      throw new Error("Database error fetching products by category");
    }
  }

  async getProductStockReport(page, limit, filters) {
    try {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const query = { is_deleted: false, active: true };

      if (filters.category) {
        query.id_category = new mongoose.Types.ObjectId(filters.category);
      }
      if (filters.subcategory) {
        query.subcategoryId = new mongoose.Types.ObjectId(filters.subcategory);
      }
      if (filters.search) {
        query.product_name = { $regex: filters.search, $options: "i" };
      }

      const pipeline = [
        { $match: query },
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
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoryId",
          },
        },
        { $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "sizemasters",
            localField: "sizeId",
            foreignField: "_id",
            as: "sizeId",
          },
        },
        { $unwind: { path: "$sizeId", preserveNullAndEmptyArrays: true } },
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
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
            ],
            as: "items",
          },
        },
        {
          $addFields: {
            totalStock: { $size: "$items" },
          },
        },
        { $project: { items: 0 } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            data: [
              { $skip: skip },
              { $limit: parseInt(limit) },
            ],
          },
        },
      ];

      const result = await ProductModel.aggregate(pipeline);
      const data = result[0]?.data || [];
      const totalCount = result[0]?.metadata[0]?.totalCount || 0;

      return {
        data,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Database error fetching stock report");
    }
  }

  async getProductLowStockReport(page, limit, lowstockThreshold) {
    try {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const threshold = parseInt(lowstockThreshold) || 5;

      const pipeline = [
        { $match: { is_deleted: false, active: true } },
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
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
            ],
            as: "items",
          },
        },
        {
          $addFields: {
            totalStock: { $size: "$items" },
          },
        },
        { $match: { totalStock: { $lte: threshold } } },
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
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoryId",
          },
        },
        { $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true } },
        { $sort: { totalStock: 1 } },
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            data: [
              { $skip: skip },
              { $limit: parseInt(limit) },
            ],
          },
        },
      ];

      const result = await ProductModel.aggregate(pipeline);
      const data = result[0]?.data || [];
      const totalCount = result[0]?.metadata[0]?.totalCount || 0;

      return {
        success: true,
        data: {
          products: data,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalDocs: totalCount,
          },
        },
      };
    } catch (err) {
      console.error(err);
      throw new Error("Database error fetching low stock report");
    }
  }

  async findByBranchId(id) {
    try {
      return await ProductModel.find({ id_branch: id, is_deleted: false, active: true }).populate(
        "id_category id_metal id_branch subcategoryId sizeId"
      );
    } catch (err) {
      throw new Error("Database error finding products by branch ID");
    }
  }
}

export default ProductRepository;
