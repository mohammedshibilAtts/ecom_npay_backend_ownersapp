import ProductModel from "../../models/chit/productModel.js";
import mongoose from "mongoose";
import config from "../../../config/chit/env.js";
import { getPricingPipeline } from "../ecom/helpers/pricingPipeline.js";
import { getS3DisplayUrl } from "../ecom/helpers/s3Cache.js";

const encodeCursor = (payload) => Buffer.from(JSON.stringify(payload)).toString("base64");
const decodeCursor = (cursor) => {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  } catch (err) {
    return null;
  }
};

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
                  from: "colors",
                  let: { colorId: "$id_color" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: [
                            "$_id",
                            { $convert: { input: "$$colorId", to: "objectId", onError: "$$colorId", onNull: "$$colorId" } }
                          ]
                        }
                      }
                    }
                  ],
                  as: "colorDetails"
                }
              },
              { $unwind: { path: "$colorDetails", preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: "certificates",
                  let: { certId: "$id_certificate" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: [
                            "$_id",
                            { $convert: { input: "$$certId", to: "objectId", onError: "$$certId", onNull: "$$certId" } }
                          ]
                        }
                      }
                    }
                  ],
                  as: "certificateDetails"
                }
              },
              { $unwind: { path: "$certificateDetails", preserveNullAndEmptyArrays: true } },
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
                  colorName: "$colorDetails.color",
                  certificateName: "$certificateDetails.name",
                },
              },
              { $project: { purityDetails: 0, colorDetails: 0, certificateDetails: 0 } },
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
          size: 1,
          categoryName: "$categoryNameRoot",
          metalName: "$metalDetails.metal_name",
          latestMetalPrice: { $ifNull: [{ $arrayElemAt: ["$metalRateInfo.rate", 0] }, 0] },
          price: "$subTotal",
          totalprice: "$calculatedPrice",
          actualTotalPrice: "$calculatedTotalPrice",
          totalAmount: "$calculatedPrice", // Alias for OrderUseCase
          discountedAmount: "$calculatedPrice", // Alias for OrderUseCase
          id_purity: "$firstItem.id_purity",
          id_color: "$firstItem.colorName",
          id_certificate: "$firstItem.certificateName",
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
          diamontUrl: {
            $concat: [
              { $ifNull: ["$s3DisplayUrl", ""] },
              `${config?.AWS_LOCAL_PATH || "uploads/"}certificates/`,
            ],
          },
          // output: "$firstItem"
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
                      // { $eq: ["$status", 2] },
                      { $eq: ["$active", true] },
                      // { $ne: ["$is_deleted", true] },
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
        ...getPricingPipeline("$id_branch._id", "firstItem"),
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
                  status: "$firstItem.status",
                  tagNo: "$firstItem.tagNo",
                  price: { $ifNull: ["$subTotal", 0] },
                  totalprice: { $ifNull: ["$calculatedPrice", 0] },
                  actualTotalPrice: { $ifNull: ["$calculatedTotalPrice", 0] },
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

  async syncProductStaticFields(purityId = null, productId = null) {
    try {
      const matchStage = { active: true, is_deleted: false };
      if (productId) {
        matchStage._id = new mongoose.Types.ObjectId(productId);
      } else if (purityId) {
        // Find products that have this metal/purity (Assuming id_purity is on the metal or item? Wait, purity is on the item or metal?)
        // To be safe and simple for the POC, if purityId is provided but not easily queryable on Product, we can just sync all for now, 
        // but let's query items to find productIds if needed, or if id_metal has purity.
        // For the POC, we'll sync all products if productId is missing.
      }

      const pipeline = [
        { $match: matchStage },
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
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            staticSortPrice: { $ifNull: ["$firstItem.totalprice", 0] },
            staticSortWeight: { $ifNull: ["$firstItem.netWeight", 0] },
          },
        },
        {
          $project: {
            staticSortPrice: 1,
            staticSortWeight: 1,
          },
        },
        {
          $merge: {
            into: "products",
            on: "_id",
            whenMatched: "merge",
            whenNotMatched: "discard",
          },
        },
      ];

      await ProductModel.aggregate(pipeline);
      console.log("Successfully synced product static fields");
      return true;
    } catch (err) {
      console.error("Error syncing static fields:", err);
      throw new Error("Database error syncing product static fields");
    }
  }

  async getProductsWithCursor(filter, limit, searchOptions, customerId = null, web = true, cursor = null) {
    try {
      const s3Url = await getS3DisplayUrl();
      const isWeb = web === true || web === "true";

      // Decode cursor: { _id, createdAt }
      let cursorFilter = {};
      if (cursor) {
        const { _id, createdAt } = decodeCursor(cursor);
        cursorFilter = {
          $or: [
            { createdAt: { $lt: new Date(createdAt) } },
            {
              createdAt: { $eq: new Date(createdAt) },
              _id: { $lt: new mongoose.Types.ObjectId(_id) },
            },
          ],
        };
      }

      const pipeline = [
        { $match: { ...filter, ...cursorFilter } },
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
                      { $eq: ["$active", true] },
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
        ...getPricingPipeline("$id_branch._id", "firstItem"),
        ...(searchOptions?.term
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
        { $sort: { createdAt: -1, _id: -1 } },
        { $limit: limit + 1 },
        {
          $project: {
            product_name: 1,
            createdAt: 1,
            product_image: 1,
            active: 1,
            bestSeller: 1,
            status: "$firstItem.status",
            tagNo: "$firstItem.tagNo",
            price: { $ifNull: ["$subTotal", 0] },
            totalprice: { $ifNull: ["$calculatedPrice", 0] },
            actualTotalPrice: { $ifNull: ["$calculatedTotalPrice", 0] },
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
      ];

      const results = await ProductModel.aggregate(pipeline);

      const hasNextPage = results.length > limit;
      const data = hasNextPage ? results.slice(0, limit) : results;

      const lastItem = data[data.length - 1];
      const nextCursor =
        hasNextPage && lastItem ? encodeCursor({ _id: lastItem._id, createdAt: lastItem.createdAt }) : null;

      return { data, nextCursor, hasNextPage };
    } catch (err) {
      console.error(err);
      throw new Error("Database error getting products via cursor pagination");
    }
  }

  async getSearchSuggestions(filter, searchOptions) {
    try {
      const CategoryModel = mongoose.model("Category");
      const SubCategoryModel = mongoose.model("SubCategory");

      const categoryPipeline = [
        {
          $match: {
            category_name: { $regex: new RegExp(searchOptions.term, "i") },
            is_deleted: false,
            active: true
          }
        },
        { $limit: 3 },
        {
          $project: {
            name: "$category_name",
          }
        }
      ];

      const subCategoryPipeline = [
        {
          $match: {
            subcategory_name: { $regex: new RegExp(searchOptions.term, "i") },
            is_deleted: false,
            active: true
          }
        },
        { $limit: 3 },
        {
          $project: {
            name: "$subcategory_name",
          }
        }
      ];

      const productPipeline = [
        { $match: filter },
        {
          $match: {
            $or: [
              { product_name: { $regex: new RegExp(searchOptions.term, "i") } },
              { sku: { $regex: new RegExp(searchOptions.term, "i") } },
            ],
          },
        },
        { $limit: 6 },
        {
          $project: {
            name: "$product_name",
          }
        }
      ];

      const [categories, subcategories, products] = await Promise.all([
        CategoryModel.aggregate(categoryPipeline),
        SubCategoryModel.aggregate(subCategoryPipeline),
        ProductModel.aggregate(productPipeline)
      ]);

      return [...categories, ...subcategories, ...products];
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
      const ProductModel = mongoose.model("Product");
      const item = await ItemModel.findOne({ productId: new mongoose.Types.ObjectId(productId), is_deleted: { $ne: true } });

      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      let status = product.onlineProduct == true ? false : true;

      await ProductModel.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { $set: { onlineProduct: status } }
      );

      let newStatus = status ? 1 : 2; // Default to derived status if no item exists

      if (item) {
        newStatus = item.status === 1 ? 2 : 1;
        item.status = newStatus;
        await item.save();
      }

      return item || { status: newStatus };
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

  async getProductBySubcategory(id, limit, filter, customerId = null, cursor = null) {
    try {
      const s3Url = await getS3DisplayUrl();
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

      if (filter.purity) {
        const purityIds = filter.purity.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
        const ItemModel = mongoose.model("Item");
        const matchingItems = await ItemModel.find({ id_purity: { $in: purityIds }, is_deleted: { $ne: true } }).select("productId").lean();
        const productIds = matchingItems.map(item => item.productId);
        match._id = { $in: productIds };
      }

      let cursorFilter = {};
      if (cursor) {
        const decoded = decodeCursor(cursor);
        if (decoded) {
          if (filter.sort === "latest") {
            cursorFilter = {
              $or: [
                { createdAt: { $lt: new Date(decoded.createdAt) } },
                { createdAt: { $eq: new Date(decoded.createdAt) }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
              ]
            };
          } else if (filter.sort === "price_lth") {
            cursorFilter = {
              $or: [
                { staticSortPrice: { $gt: decoded.staticSortPrice } },
                { staticSortPrice: { $eq: decoded.staticSortPrice }, _id: { $gt: new mongoose.Types.ObjectId(decoded._id) } }
              ]
            };
          } else if (filter.sort === "price_htl") {
            cursorFilter = {
              $or: [
                { staticSortPrice: { $lt: decoded.staticSortPrice } },
                { staticSortPrice: { $eq: decoded.staticSortPrice }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
              ]
            };
          } else if (filter.sort === "weight_lth") {
            cursorFilter = {
              $or: [
                { staticSortWeight: { $gt: decoded.staticSortWeight } },
                { staticSortWeight: { $eq: decoded.staticSortWeight }, _id: { $gt: new mongoose.Types.ObjectId(decoded._id) } }
              ]
            };
          } else if (filter.sort === "weight_htl") {
            cursorFilter = {
              $or: [
                { staticSortWeight: { $lt: decoded.staticSortWeight } },
                { staticSortWeight: { $eq: decoded.staticSortWeight }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
              ]
            };
          }
        }
      }

      const sortValue = {};
      if (filter.sort === "latest") {
        sortValue.createdAt = -1;
        sortValue._id = -1;
      } else if (filter.sort === "price_lth") {
        sortValue.staticSortPrice = 1;
        sortValue._id = 1;
      } else if (filter.sort === "price_htl") {
        sortValue.staticSortPrice = -1;
        sortValue._id = -1;
      } else if (filter.sort === "weight_lth") {
        sortValue.staticSortWeight = 1;
        sortValue._id = 1;
      } else if (filter.sort === "weight_htl") {
        sortValue.staticSortWeight = -1;
        sortValue._id = -1;
      } else {
        sortValue.createdAt = -1;
        sortValue._id = -1;
      }

      const pipeline = [
        {
          $match: { ...match, ...cursorFilter },
        },
        ...(filter.priceRange ? [{
          $match: (() => {
            const parts = filter.priceRange.split("-");
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              return { staticSortPrice: { $gte: parseFloat(parts[0]), $lte: parseFloat(parts[1]) } };
            }
            return {};
          })()
        }] : []),
        ...(filter.weightRange ? [{
          $match: (() => {
            const parts = filter.weightRange.split("-");
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              return { staticSortWeight: { $gte: parseFloat(parts[0]), $lte: parseFloat(parts[1]) } };
            }
            return {};
          })()
        }] : []),
        { $sort: sortValue },
        { $limit: parseInt(limit) + 1 }, // fetch extra

        // computations on limited items
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
        { $unwind: { path: "$firstItem", preserveNullAndEmptyArrays: true } },
        { $addFields: { s3DisplayUrl: s3Url } },
        ...(customerId ? [{
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
        }] : []),
        ...getPricingPipeline("", "firstItem"),
        {
          $project: {
            _id: 1,
            product_name: 1,
            product_image: 1,
            bestSeller: 1,
            meta: 1,
            createdAt: 1,
            status: "$firstItem.status",
            staticSortPrice: 1,
            staticSortWeight: 1,
            metalrate: 1,
            // price: "$subTotal",
            // totalprice: "$calculatedPrice",
            // actualTotalPrice: "$calculatedTotalPrice",
            price: "$calculatedPrice",
            totalprice: "$calculatedTotalPrice",
            // actualTotalPrice: "$calculatedTotalPrice",
            categoryName: "$categoryDetails.category_name",
            metalName: "$metalDetails.metal_name",
            stock: { $ifNull: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0] },
            isWishlisted: customerId ? {
              $cond: [
                { $gt: [{ $size: { $ifNull: ["$wishlistData", []] } }, 0] },
                true,
                false
              ]
            } : { $literal: false },
            pathurl: {
              $concat: [
                { $ifNull: ["$s3DisplayUrl", ""] },
                `${config?.AWS_LOCAL_PATH || "uploads/"}products/`,
              ],
            },
          }
        }
      ];

      const results = await ProductModel.aggregate(pipeline);
      const hasNextPage = results.length > limit;
      const data = hasNextPage ? results.slice(0, limit) : results;

      const lastItem = data[data.length - 1];
      const nextCursor =
        hasNextPage && lastItem ? encodeCursor({ _id: lastItem._id, createdAt: lastItem.createdAt, staticSortPrice: lastItem.staticSortPrice, staticSortWeight: lastItem.staticSortWeight }) : null;

      return {
        products: data,
        nextCursor,
        hasNextPage
      };
    } catch (err) {
      console.error(err);
      throw new Error("Database error fetching products by subcategory via aggregation");
    }
  }

  async getProductByCategory(id, limit, filter, customerId = null, cursor = null) {
    try {
      const s3Url = await getS3DisplayUrl();
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

      if (filter.subcategory) {
        const subCategoryIds = filter.subcategory.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
        match.subcategoryId = { $in: subCategoryIds };
      }

      if (filter.purity) {
        const purityIds = filter.purity.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
        const ItemModel = mongoose.model("Item");
        const matchingItems = await ItemModel.find({ id_purity: { $in: purityIds }, is_deleted: { $ne: true } }).select("productId").lean();
        const productIds = matchingItems.map(item => item.productId);
        match._id = { $in: productIds };
      }

      let cursorFilter = {};
      if (cursor) {
        const decoded = decodeCursor(cursor);
        if (filter.sort === "latest") {
          cursorFilter = {
            $or: [
              { createdAt: { $lt: new Date(decoded.createdAt) } },
              { createdAt: { $eq: new Date(decoded.createdAt) }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
            ]
          };
        } else if (filter.sort === "price_lth") {
          cursorFilter = {
            $or: [
              { staticSortPrice: { $gt: decoded.staticSortPrice } },
              { staticSortPrice: { $eq: decoded.staticSortPrice }, _id: { $gt: new mongoose.Types.ObjectId(decoded._id) } }
            ]
          };
        } else if (filter.sort === "price_htl") {
          cursorFilter = {
            $or: [
              { staticSortPrice: { $lt: decoded.staticSortPrice } },
              { staticSortPrice: { $eq: decoded.staticSortPrice }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
            ]
          };
        } else if (filter.sort === "weight_lth") {
          cursorFilter = {
            $or: [
              { staticSortWeight: { $gt: decoded.staticSortWeight } },
              { staticSortWeight: { $eq: decoded.staticSortWeight }, _id: { $gt: new mongoose.Types.ObjectId(decoded._id) } }
            ]
          };
        } else if (filter.sort === "weight_htl") {
          cursorFilter = {
            $or: [
              { staticSortWeight: { $lt: decoded.staticSortWeight } },
              { staticSortWeight: { $eq: decoded.staticSortWeight }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
            ]
          };
        } else {
          cursorFilter = {
            $or: [
              { createdAt: { $lt: new Date(decoded.createdAt) } },
              { createdAt: { $eq: new Date(decoded.createdAt) }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
            ]
          };
        }
      }

      const sortValue = {};
      if (filter.sort === "latest") {
        sortValue.createdAt = -1;
        sortValue._id = -1;
      } else if (filter.sort === "price_lth") {
        sortValue.staticSortPrice = 1;
        sortValue._id = 1;
      } else if (filter.sort === "price_htl") {
        sortValue.staticSortPrice = -1;
        sortValue._id = -1;
      } else if (filter.sort === "weight_lth") {
        sortValue.staticSortWeight = 1;
        sortValue._id = 1;
      } else if (filter.sort === "weight_htl") {
        sortValue.staticSortWeight = -1;
        sortValue._id = -1;
      } else {
        sortValue.createdAt = -1;
        sortValue._id = -1;
      }

      const pipeline = [
        {
          $match: { ...match, ...cursorFilter },
        },
        // IMPORTANT: We filter by Price Range BEFORE limiting if we rely on staticSortPrice
        ...(filter.priceRange ? [{
          $match: (() => {
            const parts = filter.priceRange.split("-");
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              return { staticSortPrice: { $gte: parseFloat(parts[0]), $lte: parseFloat(parts[1]) } };
            }
            return {};
          })()
        }] : []),
        ...(filter.weightRange ? [{
          $match: (() => {
            const parts = filter.weightRange.split("-");
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              return { staticSortWeight: { $gte: parseFloat(parts[0]), $lte: parseFloat(parts[1]) } };
            }
            return {};
          })()
        }] : []),
        { $sort: sortValue },
        { $limit: parseInt(limit) + 1 }, // Limit to 10 + 1 to check for next page

        // --- HEAVY COMPUTATIONS ONLY ON THE 10 LIMITED ITEMS ---
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
        ...(customerId ? [{
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
        }] : []),
        ...getPricingPipeline("", "firstItem"),
        {
          $project: {
            _id: 1,
            product_name: 1,
            product_image: 1,
            bestSeller: 1,
            createdAt: 1,
            status: "$firstItem.status",
            staticSortPrice: 1,
            staticSortWeight: 1,
            isWishlisted: customerId ? {
              $cond: [
                { $gt: [{ $size: { $ifNull: ["$wishlistData", []] } }, 0] },
                true,
                false
              ]
            } : { $literal: false },
            // price: "$subTotal",
            // totalprice: "$calculatedPrice",
            // actualTotalPrice: "$calculatedTotalPrice",
            totalprice: "$calculatedTotalPrice",
            price: "$calculatedPrice",
            actualTotalPrice: "$calculatedTotalPrice",
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
      ];

      const results = await ProductModel.aggregate(pipeline);
      const hasNextPage = results.length > limit;
      const data = hasNextPage ? results.slice(0, limit) : results;

      const lastItem = data[data.length - 1];
      const nextCursor =
        hasNextPage && lastItem ? encodeCursor({ _id: lastItem._id, createdAt: lastItem.createdAt, staticSortPrice: lastItem.staticSortPrice, staticSortWeight: lastItem.staticSortWeight }) : null;

      return {
        products: data,
        nextCursor,
        hasNextPage
      };
    } catch (err) {
      console.error(err);
      throw new Error("Database error fetching products by subcategory via cursor pagination");
    }
  }

  async getProductStockReport(page, limit, filters) {
    try {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const query = { is_deleted: false, active: true };
      let metalNameFilter = null;

      if (filters.category) {
        query.id_category = new mongoose.Types.ObjectId(filters.category);
      }
      if (filters.subcategory) {
        query.subcategoryId = new mongoose.Types.ObjectId(filters.subcategory);
      }
      if (filters.search) {
        const ItemModel = mongoose.model("Item");
        const productIds = await ItemModel.distinct("productId", {
          tagNo: { $regex: filters.search, $options: "i" }
        });

        query.$or = [
          { product_name: { $regex: filters.search, $options: "i" } },
          { sku: { $regex: filters.search, $options: "i" } },
          { _id: { $in: productIds } }
        ];
      }
      if (filters.metal) {
        const metalFilter = String(filters.metal).trim();
        if (mongoose.Types.ObjectId.isValid(metalFilter)) {
          query.id_metal = new mongoose.Types.ObjectId(metalFilter);
        } else {
          metalNameFilter = metalFilter;
        }
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
      ];

      if (metalNameFilter) {
        pipeline.push(
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
            $match: {
              "metalDetails.metal_name": { $regex: new RegExp(`^${metalNameFilter}$`, "i") },
            },
          }
        );
      }

      pipeline.push(
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
            grossWeight: {
              $sum: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: { $ifNull: ["$$item.grossWt", 0] }
                }
              }
            }
          }
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
      );

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
        {
          $group: {
            _id: "$id_category",
            totalStock: { $sum: "$totalStock" },
            productCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            category_name: "$categoryDetails.category_name",
          },
        },
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
          products: data, // Keep it as 'products' to maintain frontend compatibility
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
