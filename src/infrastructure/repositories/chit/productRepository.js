import ProductModel from "../../models/chit/productModel.js";
import categoryModel from "../../models/chit/categoryModel.js";
import mongoose from "mongoose";
import moment from "moment";
import { OrderItem } from "../../models/ecom/orderItemModel.js";
import { ORDER_STATUS_NO, ORDER_TYPE } from "../../../config/chit/const.js";
import config from "../../../config/chit/env.js";

class ProductRepository {
  async findByName(product_name, id_branch, id) {
    try {
      const filter = {
        product_name: product_name,
        is_deleted: false,
        id_branch: id_branch,
      };

      if (id) {
        filter._id = { $ne: id };
      }

      const findProduct = await ProductModel.findOne(filter);

      if (!findProduct) return null;

      return {
        product_name: findProduct.product_name,
        _id: findProduct._id,
      };
    } catch (err) {
      throw new Error("Database error occurred while finding Product by name");
    }
  }

  async addProduct(productData) {
    try {
      const saveProduct = new ProductModel(productData);
      await saveProduct.save();
      return saveProduct;
    } catch (err) {
      console.error(err);

      throw new Error("Database error occurred while add product");
    }
  }

  async findByCode(code) {
    try {
      const findByCode = await ProductModel.find({ code, is_deleted: false });
      if (findByCode.length == 0) {
        return null;
      }
      return true;
    } catch (err) {
      throw new Error("Database error occurred while find product code");
    }
  }

  async findById(id, customerId) {
    try {
      const isValidCustomerId =
        customerId && mongoose.Types.ObjectId.isValid(customerId);

      const userData = await ProductModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "s3bucketsettings",
            localField: "id_branch",
            foreignField: "id_branch",
            as: "s3Details",
          },
        },
        { $unwind: "$s3Details" },
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "purities",
            localField: "id_purity",
            foreignField: "_id",
            as: "purityDetails",
          },
        },
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metalsDetails",
          },
        },
        {
          $lookup: {
            from: "branches",
            localField: "id_branch",
            foreignField: "_id",
            as: "branches",
          },
        },
        {
          $lookup: {
            from: "sizemasters",
            localField: "availableSizes.sizeId",
            foreignField: "_id",
            as: "Size",
          },
        },
        { $unwind: { path: "$Size", preserveNullAndEmptyArrays: true } },

        { $unwind: "$branches" },
        ...(isValidCustomerId
          ? [
              {
                $lookup: {
                  from: "wishlists",
                  let: { productId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$itemId", "$$productId"] },
                            {
                              $eq: [
                                "$id_customer",
                                new mongoose.Types.ObjectId(customerId),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "wishlistMatch",
                },
              },
              {
                $addFields: {
                  isWishlisted: { $gt: [{ $size: "$wishlistMatch" }, 0] },
                },
              },
            ]
          : [
              {
                $addFields: { isWishlisted: false },
              },
            ]),
        {
          $lookup: {
            from: "metalrates",
            let: {
              metalId: "$id_metal",
              purityId: "$id_purity",
              id_branch: "$id_branch",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$material_type_id", "$$metalId"] },
                      { $eq: ["$purity_id", "$$purityId"] },
                      { $eq: ["$id_branch", "$$id_branch"] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: "metalPriceInfo",
          },
        },
        // CORRECTED STONE DETAILS LOOKUP
        {
          $lookup: {
            from: "stonedetails",
            localField: "stoneDetails",
            foreignField: "_id",
            as: "stoneDiamondDetails",
          },
        },
        // Lookup stone master details for each stone detail
        {
          $unwind: {
            path: "$stoneDiamondDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stone_masters",
            localField: "stoneDiamondDetails.itemId",
            foreignField: "_id",
            as: "stoneDiamondDetails.stoneInfo",
          },
        },
        {
          $unwind: {
            path: "$stoneDiamondDetails.stoneInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Group back the stone details into an array
        {
          $group: {
            _id: "$_id",
            root: { $first: "$$ROOT" },
            stoneDiamondDetails: { $push: "$stoneDiamondDetails" },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$root",
                { stoneDiamondDetails: "$stoneDiamondDetails" },
              ],
            },
          },
        },
        // Continue with your existing calculations...
        {
          $addFields: {
            latestMetalPrice: {
              $ifNull: [{ $arrayElemAt: ["$metalPriceInfo.rate", 0] }, 0],
            },
          },
        },
        {
          $addFields: {
            baseMetalValue: {
              $multiply: [
                { $ifNull: ["$netWeight", 0] },
                { $ifNull: ["$latestMetalPrice", 0] },
              ],
            },
          },
        },
        {
          $addFields: {
            rawMakingCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$makingCharges.mode", 1] },
                    then: { $ifNull: ["$makingCharges.actualValue", 0] },
                  },
                  {
                    case: { $eq: ["$makingCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$makingCharges.actualValue", 0] },
                      ],
                    },
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            rawWastageCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$wastageCharges.mode", 1] },
                    then: { $ifNull: ["$wastageCharges.actualValue", 0] },
                  },
                  {
                    case: { $eq: ["$wastageCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$wastageCharges.actualValue", 0] },
                      ],
                    },
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            finalMakingCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$makingCharges.mode", 1] },
                    then: {
                      $ifNull: ["$makingCharges.discountedValue", 0],
                    },
                  },
                  {
                    case: { $eq: ["$makingCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$makingCharges.discountedValue", 0] },
                      ],
                    },
                  },
                ],
                default: 0,
              },
            },
            finalWastageCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$wastageCharges.mode", 1] },
                    then: {
                      $ifNull: ["$wastageCharges.discountedValue", 0],
                    },
                  },
                  {
                    case: { $eq: ["$wastageCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$wastageCharges.discountedValue", 0] },
                      ],
                    },
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            diamondValue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "diamond"] },
                    },
                  },
                  as: "diamond",
                  in: { $ifNull: ["$$diamond.price", 0] },
                },
              },
            },
            stoneValue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "stone"] },
                    },
                  },
                  as: "stone",
                  in: { $ifNull: ["$$stone.price", 0] },
                },
              },
            },
          },
        },
        // NEW: Add fields for total diamond and stone metrics
        {
          $addFields: {
            // Diamond totals
            totalDiamondWeight: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "diamond"] },
                    },
                  },
                  as: "diamond",
                  in: { $ifNull: ["$$diamond.weight", 0] },
                },
              },
            },
            totalDiamondCost: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "diamond"] },
                    },
                  },
                  as: "diamond",
                  in: { $ifNull: ["$$diamond.cost", 0] },
                },
              },
            },
            totalDiamondPrice: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "diamond"] },
                    },
                  },
                  as: "diamond",
                  in: { $ifNull: ["$$diamond.price", 0] },
                },
              },
            },
            totalDiamondCount: {
              $size: {
                $filter: {
                  input: "$stoneDiamondDetails",
                  as: "sd",
                  cond: { $eq: ["$$sd.type", "diamond"] },
                },
              },
            },

            // Stone totals
            totalStoneWeight: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "stone"] },
                    },
                  },
                  as: "stone",
                  in: { $ifNull: ["$$stone.weight", 0] },
                },
              },
            },
            totalStoneCost: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "stone"] },
                    },
                  },
                  as: "stone",
                  in: { $ifNull: ["$$stone.cost", 0] },
                },
              },
            },
            totalStonePrice: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "stone"] },
                    },
                  },
                  as: "stone",
                  in: { $ifNull: ["$$stone.price", 0] },
                },
              },
            },
            totalStoneCount: {
              $size: {
                $filter: {
                  input: "$stoneDiamondDetails",
                  as: "sd",
                  cond: { $eq: ["$$sd.type", "stone"] },
                },
              },
            },

            // Combined totals (both diamonds and stones)
            totalGemstoneWeight: {
              $sum: "$stoneDiamondDetails.weight",
            },
            totalGemstoneCost: {
              $sum: "$stoneDiamondDetails.cost",
            },
            totalGemstonePrice: {
              $sum: "$stoneDiamondDetails.price",
            },
            totalGemstoneCount: {
              $size: "$stoneDiamondDetails",
            },
          },
        },
        {
          $addFields: {
            discountedSubtotal: {
              $add: [
                { $ifNull: ["$baseMetalValue", 0] },
                { $ifNull: ["$finalWastageCharge", 0] },
                { $ifNull: ["$finalMakingCharge", 0] },
                { $ifNull: ["$diamondValue", 0] },
                { $ifNull: ["$stoneValue", 0] },
              ],
            },
            actualSubtotal: {
              $add: [
                { $ifNull: ["$baseMetalValue", 0] },
                { $ifNull: ["$rawWastageCharge", 0] },
                { $ifNull: ["$rawMakingCharge", 0] },
                { $ifNull: ["$diamondValue", 0] },
                { $ifNull: ["$stoneValue", 0] },
              ],
            },
          },
        },
        {
          $addFields: {
            gstRate: {
              $cond: {
                if: {
                  $and: [
                    { $gt: ["$gst", 0] },
                    { $gt: ["$discountedSubtotal", 0] },
                  ],
                },
                then: {
                  $divide: [
                    { $multiply: ["$discountedSubtotal", "$gst"] },
                    100,
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $addFields: {
            actualGstRate: {
              $cond: {
                if: {
                  $and: [{ $gt: ["$gst", 0] }, { $gt: ["$actualSubtotal", 0] }],
                },
                then: {
                  $divide: [{ $multiply: ["$actualSubtotal", "$gst"] }, 100],
                },
                else: 0,
              },
            },
          },
        },
        {
          $addFields: {
            discountedAmount: {
              $add: [
                { $ifNull: ["$discountedSubtotal", 0] },
                { $ifNull: ["$gstRate", 0] },
              ],
            },
            totalAmount: {
              $add: [
                { $ifNull: ["$actualSubtotal", 0] },
                { $ifNull: ["$actualGstRate", 0] },
              ],
            },
          },
        },
        {
          $project: {
            product_name: 1,
            description: 1,
            product_image: 1,
            id_category: 1,
            showprice: 1,
            id_branch: 1,
            subcategoryId: 1,
            categoryName: "$category.category_name",
            pathurl: {
              $concat: [
                "$s3Details.s3display_url",
                `${config?.AWS_LOCAL_PATH}products/`,
              ],
            },
            isWishlisted: 1,
            totalAmount: 1,
            discountedAmount: 1,
            purityName: { $arrayElemAt: ["$purityDetails.purity_name", 0] },
            metalName: { $arrayElemAt: ["$metalsDetails.metal_name", 0] },
            netWeight: "$netWeight",
            grossWeight: "$grossWt",
            sku: 1,
            availableSizes: 1,
            makingCharges: 1,
            wastageCharges: 1,
            latestMetalPrice: "$latestMetalPrice",
            totalDiamondWeight: 1,
            totalDiamondCost: 1,
            totalDiamondPrice: 1,
            totalDiamondCount: 1,
            totalStoneWeight: 1,
            totalStoneCost: 1,
            totalStonePrice: 1,
            totalStoneCount: 1,
            id_purity: 1,
            id_metal: 1,
            gst: "$gstRate",
            baseMetalValue: 1,
            finalWastageCharge: 1,
            finalMakingCharge: 1,
            bestSeller: 1,
            code: 1,
            collection: 1,
            netWeight: 1,
            grossWt: 1,
            sizeUnit: "$Size.unit",
            onlineProduct: { $ifNull: ["$onlineProduct", true] },
            stoneDiamondDetails: 1,
            active: 1,
            sizeId: 1,
            isMrp: 1,
          },
        },
        { $limit: 1 },
      ]);

      const productData = userData[0];
      if (productData?.onlineProduct == false) {
        productData.orderStatus = await this.findProductForOrderNow(
          id,
          customerId,
        );
      }

      return productData ? productData : null;
    } catch (err) {
      console.error(err);
      throw new Error("Database error occurred while finding Product by id");
    }
  }

  //   async findById(id, customerId) {
  //   try {
  //     const isValidCustomerId =
  //       customerId && mongoose.Types.ObjectId.isValid(customerId);

  //     const userData = await ProductModel.aggregate([
  //       {
  //         $match: {
  //           _id: new mongoose.Types.ObjectId(id),
  //           is_deleted: false,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "s3bucketsettings",
  //           localField: "id_branch",
  //           foreignField: "id_branch",
  //           as: "s3Details",
  //         },
  //       },
  //       { $unwind: "$s3Details" },
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "id_category",
  //           foreignField: "_id",
  //           as: "category",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "purities",
  //           localField: "id_purity",
  //           foreignField: "_id",
  //           as: "purityDetails",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "branches",
  //           localField: "id_branch",
  //           foreignField: "_id",
  //           as: "branches",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "sizemasters",
  //           localField: "availableSizes.sizeId",
  //           foreignField: "_id",
  //           as: "Size",
  //         },
  //       },
  //       { $unwind: { path: "$Size", preserveNullAndEmptyArrays: true } },
  //       { $unwind: "$branches" },

  //       ...(isValidCustomerId
  //         ? [
  //             {
  //               $lookup: {
  //                 from: "wishlists",
  //                 let: { productId: "$_id" },
  //                 pipeline: [
  //                   {
  //                     $match: {
  //                       $expr: {
  //                         $and: [
  //                           { $eq: ["$itemId", "$$productId"] },
  //                           {
  //                             $eq: [
  //                               "$id_customer",
  //                               new mongoose.Types.ObjectId(customerId),
  //                             ],
  //                           },
  //                         ],
  //                       },
  //                     },
  //                   },
  //                 ],
  //                 as: "wishlistMatch",
  //               },
  //             },
  //             {
  //               $addFields: {
  //                 isWishlisted: { $gt: [{ $size: "$wishlistMatch" }, 0] },
  //               },
  //             },
  //           ]
  //         : [
  //             {
  //               $addFields: { isWishlisted: false },
  //             },
  //           ]),

  //       {
  //         $lookup: {
  //           from: "metalrates",
  //           let: { metalId: "$id_metal", purityId: "$id_purity", id_branch: "$id_branch" },
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: {
  //                   $and: [
  //                     { $eq: ["$material_type_id", "$$metalId"] },
  //                     { $eq: ["$purity_id", "$$purityId"] },
  //                     { $eq: ["$id_branch", "$$id_branch"] },
  //                   ],
  //                 },
  //               },
  //             },
  //             { $sort: { createdAt: -1 } },
  //             { $limit: 1 },
  //           ],
  //           as: "metalPriceInfo",
  //         },
  //       },

  //       {
  //         $lookup: {
  //           from: "stonedetails",
  //           localField: "stoneDetails",
  //           foreignField: "_id",
  //           as: "stoneDiamondDetails",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$stoneDiamondDetails",
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "stone_masters",
  //           localField: "stoneDiamondDetails.itemId",
  //           foreignField: "_id",
  //           as: "stoneDiamondDetails.stoneInfo",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$stoneDiamondDetails.stoneInfo",
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },

  //       {
  //         $group: {
  //           _id: "$_id",
  //           root: { $first: "$$ROOT" },
  //           stoneDiamondDetails: { $push: "$stoneDiamondDetails" },
  //         },
  //       },
  //       {
  //         $replaceRoot: {
  //           newRoot: {
  //             $mergeObjects: ["$root", { stoneDiamondDetails: "$stoneDiamondDetails" }],
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           latestMetalPrice: {
  //             $ifNull: [{ $arrayElemAt: ["$metalPriceInfo.rate", 0] }, 0],
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           baseMetalValue: {
  //             $multiply: [
  //               { $ifNull: ["$netWeight", 0] },
  //               { $ifNull: ["$latestMetalPrice", 0] },
  //             ],
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           rawMakingCharge: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: { $eq: ["$makingCharges.mode", 1] },
  //                   then: { $ifNull: ["$makingCharges.actualValue", 0] },
  //                 },
  //                 {
  //                   case: { $eq: ["$makingCharges.mode", 2] },
  //                   then: {
  //                     $multiply: [
  //                       { $ifNull: ["$grossWt", 0] },
  //                       { $ifNull: ["$makingCharges.actualValue", 0] },
  //                     ],
  //                   },
  //                 },
  //               ],
  //               default: 0,
  //             },
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           rawWastageCharge: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: { $eq: ["$wastageCharges.mode", 1] },
  //                   then: { $ifNull: ["$wastageCharges.actualValue", 0] },
  //                 },
  //                 {
  //                   case: { $eq: ["$wastageCharges.mode", 2] },
  //                   then: {
  //                     $multiply: [
  //                       { $ifNull: ["$grossWt", 0] },
  //                       { $ifNull: ["$wastageCharges.actualValue", 0] },
  //                     ],
  //                   },
  //                 },
  //               ],
  //               default: 0,
  //             },
  //           },
  //         },
  //       },

  //       // ❌ REMOVED $round FROM FINAL MAKING & WASTAGE CHARGE
  //       {
  //         $addFields: {
  //           finalMakingCharge: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: { $eq: ["$makingCharges.mode", 1] },
  //                   then: { $ifNull: ["$makingCharges.discountedValue", 0] },
  //                 },
  //                 {
  //                   case: { $eq: ["$makingCharges.mode", 2] },
  //                   then: {
  //                     $multiply: [
  //                       { $ifNull: ["$grossWt", 0] },
  //                       { $ifNull: ["$makingCharges.discountedValue", 0] },
  //                     ],
  //                   },
  //                 },
  //               ],
  //               default: 0,
  //             },
  //           },

  //           finalWastageCharge: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: { $eq: ["$wastageCharges.mode", 1] },
  //                   then: { $ifNull: ["$wastageCharges.discountedValue", 0] },
  //                 },
  //                 {
  //                   case: { $eq: ["$wastageCharges.mode", 2] },
  //                   then: {
  //                     $multiply: [
  //                       { $ifNull: ["$grossWt", 0] },
  //                       { $ifNull: ["$wastageCharges.discountedValue", 0] },
  //                     ],
  //                   },
  //                 },
  //               ],
  //               default: 0,
  //             },
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           diamondValue: {
  //             $sum: {
  //               $map: {
  //                 input: {
  //                   $filter: {
  //                     input: "$stoneDiamondDetails",
  //                     as: "sd",
  //                     cond: { $eq: ["$$sd.type", "diamond"] },
  //                   },
  //                 },
  //                 as: "diamond",
  //                 in: { $ifNull: ["$$diamond.price", 0] },
  //               },
  //             },
  //           },
  //           stoneValue: {
  //             $sum: {
  //               $map: {
  //                 input: {
  //                   $filter: {
  //                     input: "$stoneDiamondDetails",
  //                     as: "sd",
  //                     cond: { $eq: ["$$sd.type", "stone"] },
  //                   },
  //                 },
  //                 as: "stone",
  //                 in: { $ifNull: ["$$stone.price", 0] },
  //               },
  //             },
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           // diamond totals
  //           totalDiamondWeight: {
  //             $sum: "$stoneDiamondDetails.weight",
  //           },
  //           totalDiamondCost: {
  //             $sum: "$stoneDiamondDetails.cost",
  //           },
  //           totalDiamondPrice: {
  //             $sum: "$stoneDiamondDetails.price",
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           discountedSubtotal: {
  //             $add: [
  //               { $ifNull: ["$baseMetalValue", 0] },
  //               { $ifNull: ["$finalWastageCharge", 0] },
  //               { $ifNull: ["$finalMakingCharge", 0] },
  //               { $ifNull: ["$diamondValue", 0] },
  //               { $ifNull: ["$stoneValue", 0] },
  //             ],
  //           },
  //           actualSubtotal: {
  //             $add: [
  //               { $ifNull: ["$baseMetalValue", 0] },
  //               { $ifNull: ["$rawWastageCharge", 0] },
  //               { $ifNull: ["$rawMakingCharge", 0] },
  //               { $ifNull: ["$diamondValue", 0] },
  //               { $ifNull: ["$stoneValue", 0] },
  //             ],
  //           },
  //         },
  //       },

  //       {
  //         $addFields: {
  //           gstRate: {
  //             $cond: {
  //               if: {
  //                 $and: [
  //                   { $gt: ["$gst", 0] },
  //                   { $gt: ["$discountedSubtotal", 0] },
  //                 ],
  //               },
  //               then: {
  //                 $divide: [
  //                   { $multiply: ["$discountedSubtotal", "$gst"] },
  //                   100,
  //                 ],
  //               },
  //               else: 0,
  //             },
  //           },
  //         },
  //       },

  //       // ❌ REMOVED $round FROM TOTALS
  //       {
  //         $addFields: {
  //           discountedAmount: {
  //             $add: [
  //               { $ifNull: ["$discountedSubtotal", 0] },
  //               { $ifNull: ["$gstRate", 0] },
  //             ],
  //           },
  //           totalAmount: {
  //             $add: [
  //               { $ifNull: ["$actualSubtotal", 0] },
  //               { $ifNull: ["$gstRate", 0] },
  //             ],
  //           },
  //         },
  //       },

  //       {
  //         $project: {
  //           product_name: 1,
  //           description: 1,
  //           product_image: 1,
  //           id_category: 1,
  //           showprice: 1,
  //           id_branch: 1,
  //           subcategoryId: 1,
  //           categoryName: "$category.category_name",
  //           pathurl: {
  //             $concat: [
  //               "$s3Details.s3display_url",
  //               `${config?.AWS_LOCAL_PATH}products/`,
  //             ],
  //           },
  //           isWishlisted: 1,
  //           totalAmount: 1,
  //           discountedAmount: 1,
  //           purityName: { $arrayElemAt: ["$purityDetails.purity_name", 0] },
  //           netWeight: "$netWeight",
  //           grossWeight: "$grossWt",
  //           sku: 1,
  //           availableSizes: 1,
  //           makingCharges: 1,
  //           wastageCharges: 1,
  //           latestMetalPrice: "$latestMetalPrice",
  //           stoneDiamondDetails: 1,
  //           baseMetalValue: 1,
  //           finalWastageCharge: 1,
  //           finalMakingCharge: 1,
  //           active: 1,
  //         },
  //       },

  //       { $limit: 1 },
  //     ]);

  //     const productData = userData[0];

  //     if (productData?.onlineProduct == false) {
  //       productData.orderStatus = await this.findProductForOrderNow(
  //         id,
  //         customerId
  //       );
  //     }

  //     return productData || null;

  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Database error occurred while finding Product by id");
  //   }
  // }

  async editProduct(productData, id) {
    try {
      const editProduct = await ProductModel.updateOne(
        { _id: id },
        { $set: productData },
      );
      if (editProduct.modifiedCount == 1) {
        return editProduct;
      } else {
        return null;
      }
    } catch (err) {
      console.log("wertyuiop", err);
      throw new Error("Database error occurred while editing Product");
    }
  }

  async deleteProduct(id) {
    try {
      const deleteProduct = await ProductModel.updateOne(
        { _id: id },
        { is_deleted: true },
      );
      if (deleteProduct.modifiedCount == 1) {
        return true;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error("Database error occurred while deleting Product");
    }
  }

  async changeStatus(id, status) {
    try {
      console.log(status);
      const updateStatus = await ProductModel.updateOne(
        { _id: id },
        { active: !status },
      );
      if (updateStatus.modifiedCount == 1) {
        console.log(updateStatus);
        return updateStatus;
      }
      return null;
    } catch (err) {
      throw new Error("Database error occurred while changing product status");
    }
  }

  async findByBranchId(id) {
    try {
      const productData = await ProductModel.find({
        id_branch: id,
        is_deleted: false,
        active: true,
      });
      if (productData.length >= 1) {
        return productData;
      }
      return null;
    } catch (err) {
      throw new Error("Database error occurred while get product by Branch");
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
            from: "s3bucketsettings",
            localField: "id_branch._id",
            foreignField: "id_branch",
            as: "s3Details",
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
              {
                $count: "stockCount",
              },
            ],
            as: "stockData",
          },
        },
        {
          $addFields: {
            stock: {
              $ifNull: [{ $arrayElemAt: ["$stockData.stockCount", 0] }, 0],
            },
          },
        },
        { $unwind: { path: "$s3Details", preserveNullAndEmptyArrays: true } },
        ...(customerId
          ? [
              {
                $lookup: {
                  from: "wishlists",
                  let: { productId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$itemId", "$$productId"] },
                            {
                              $eq: [
                                "$id_customer",
                                new mongoose.Types.ObjectId(customerId),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "wishlistMatch",
                },
              },
              {
                $addFields: {
                  isWishlisted: {
                    $gt: [{ $size: "$wishlistMatch" }, 0],
                  },
                },
              },
            ]
          : [
              {
                $addFields: {
                  isWishlisted: false,
                },
              },
            ]),
      ];

      if (searchOptions && searchOptions.term) {
        const searchWords = searchOptions.term
          .split(/\s+|[()]/g)
          .filter((word) => word.length > 0);
        const orConditions = [];

        searchWords.forEach((word) => {
          const wordRegex = new RegExp(
            word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i",
          );

          orConditions.push(
            { product_name: { $regex: wordRegex } },
            { "id_branch.branch_name": { $regex: wordRegex } },
            { "id_category.category_name": { $regex: wordRegex } },
            { "id_metal.metal_name": { $regex: wordRegex } },
          );
        });

        if (!isNaN(searchOptions.term)) {
          const numSearch = parseFloat(searchOptions.term);
          orConditions.push({ weight: numSearch });
        }

        const momentDate = moment(
          searchOptions.term,
          ["DD/MM/YYYY", "YYYY-MM-DD"],
          true,
        );
        if (momentDate.isValid()) {
          const startOfDay = momentDate.startOf("day").toDate();
          const endOfDay = momentDate.endOf("day").toDate();

          orConditions.push({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });
        }

        pipeline.push({
          $match: { $or: orConditions },
        });
      }

      pipeline.push(
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            product_name: 1,
            createdAt: 1,
            product_image: 1,
            active: 1,
            bestSeller: "$bestSeller",
            branchName: "$id_branch.branch_name",
            metalName: "$id_metal.metal_name",
            isWishlisted: 1,
            quantity: "$quantity",
            onlineProduct: 1,
            stock:1,
            pathurl: {
              $concat: [
                "$s3Details.s3display_url",
                `${config?.AWS_LOCAL_PATH}products/`,
              ],
            },
          },
        },
      );

      const products = await ProductModel.aggregate(pipeline);
      return products;
    } catch (err) {
      console.error(err);
      throw new Error("Database error occurred while fetching products");
    }
  }

  async countProduct(filter) {
    return await ProductModel.countDocuments(filter);
  }

  async updateCount(id, count) {
    try {
      const countUpdate = await ProductModel.updateOne(
        { _id: id },
        { $set: { whatsapp_sent: count } },
      );

      if (countUpdate.modifiedCount > 0) {
        return countUpdate;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  }

  async getProductBySubcategory(subcategory, page, limit, userId, filters) {
    try {
      const skip = (page - 1) * limit;
      const sortOption = filters?.sort || { createdAt: -1 };
      const priceFilter = filters?.priceFilter || {};

      const aggregationPipeline = [
        {
          $match: {
            subcategoryId: subcategory,
            active: true,
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "wishlists",
            let: {
              productId: "$_id",
              customerId: userId ? { $toString: userId } : null,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$id_customer",
                          new mongoose.Types.ObjectId(userId),
                        ],
                      },
                      { $eq: ["$itemId", "$$productId"] },
                    ],
                  },
                },
              },
            ],
            as: "wishlistInfo",
          },
        },
        {
          $addFields: {
            isWishlist: { $gt: [{ $size: "$wishlistInfo" }, 0] },
          },
        },
        {
          $lookup: {
            from: "metalrates",
            let: {
              metalId: "$id_metal",
              purityId: "$id_purity",
              branchId: "$id_branch",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$material_type_id", "$$metalId"] },
                      { $eq: ["$purity_id", "$$purityId"] },
                      { $eq: ["$id_branch", "$$branchId"] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: "metalPriceInfo",
          },
        },
        {
          $lookup: {
            from: "stonedetails",
            localField: "stoneDetails",
            foreignField: "_id",
            as: "stoneDiamondDetails",
          },
        },

        {
          $addFields: {
            latestMetalPrice: {
              $ifNull: [{ $arrayElemAt: ["$metalPriceInfo.rate", 0] }, 0],
            },
            netWeight: {
              $ifNull: ["$netWeight", "$grossWt"],
            },
          },
        },
        {
          $addFields: {
            baseMetalValue: {
              $multiply: [
                { $ifNull: ["$netWeight", 0] },
                { $ifNull: ["$latestMetalPrice", 0] },
              ],
            },
          },
        },
        {
          $addFields: {
            rawMakingCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$makingCharges.mode", 1] },
                    then: { $ifNull: ["$makingCharges.actualValue", 0] },
                  },
                  {
                    case: { $eq: ["$makingCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$makingCharges.actualValue", 0] },
                      ],
                    },
                  },
                ],

                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            finalMakingCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$makingCharges.mode", 1] },
                    then: {
                      $ifNull: ["$makingCharges.discountedValue", 0],
                    },
                  },
                  {
                    case: { $eq: ["$makingCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$makingCharges.discountedValue", 0] },
                      ],
                    },
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            rawWastageCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$wastageCharges.mode", 1] },
                    then: { $ifNull: ["$wastageCharges.actualValue", 0] },
                  },
                  {
                    case: { $eq: ["$wastageCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$wastageCharges.actualValue", 0] },
                      ],
                    },
                  },
                ],

                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            finalWastageCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$wastageCharges.mode", 1] },
                    then: {
                      $ifNull: ["$wastageCharges.discountedValue", 0],
                    },
                  },
                  {
                    case: { $eq: ["$wastageCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$grossWt", 0] },
                        { $ifNull: ["$wastageCharges.discountedValue", 0] },
                      ],
                    },
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            diamondValue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "diamond"] },
                    },
                  },
                  as: "diamond",
                  in: { $ifNull: ["$$diamond.price", 0] },
                },
              },
            },
            stoneValue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$stoneDiamondDetails",
                      as: "sd",
                      cond: { $eq: ["$$sd.type", "stone"] },
                    },
                  },
                  as: "stone",
                  in: { $ifNull: ["$$stone.price", 0] },
                },
              },
            },
          },
        },
        {
          $addFields: {
            discountedSubtotal: {
              $add: [
                { $ifNull: ["$baseMetalValue", 0] },
                { $ifNull: ["$finalWastageCharge", 0] },
                { $ifNull: ["$finalMakingCharge", 0] },
                { $ifNull: ["$diamondValue", 0] },
                { $ifNull: ["$stoneValue", 0] },
              ],
            },
            actualSubtotal: {
              $add: [
                { $ifNull: ["$baseMetalValue", 0] },
                { $ifNull: ["$rawWastageCharge", 0] },
                { $ifNull: ["$rawMakingCharge", 0] },
                { $ifNull: ["$diamondValue", 0] },
                { $ifNull: ["$stoneValue", 0] },
              ],
            },
          },
        },

        {
          $addFields: {
            gstRate: {
              $cond: {
                if: {
                  $and: [
                    { $gt: ["$gst", 0] },
                    { $gt: ["$discountedSubtotal", 0] },
                  ],
                },
                then: {
                  $divide: [
                    { $multiply: ["$discountedSubtotal", "$gst"] },
                    100,
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $addFields: {
            actualGstRate: {
              $cond: {
                if: {
                  $and: [{ $gt: ["$gst", 0] }, { $gt: ["$actualSubtotal", 0] }],
                },
                then: {
                  $divide: [{ $multiply: ["$actualSubtotal", "$gst"] }, 100],
                },
                else: 0,
              },
            },
          },
        },
        {
          $addFields: {
            discountedAmount: {
              $add: [
                { $ifNull: ["$discountedSubtotal", 0] },
                { $ifNull: ["$gstRate", 0] },
              ],
            },

            totalAmount: {
              $add: [
                { $ifNull: ["$actualSubtotal", 0] },
                { $ifNull: ["$actualGstRate", 0] },
              ],
            },
          },
        },

        {
          $addFields: {
            discountDifference: {
              $subtract: [
                { $ifNull: ["$totalAmount", 0] },
                { $ifNull: ["$discountedAmount", 0] },
              ],
            },
          },
        },

        ...(Object.keys(priceFilter).length > 0
          ? [{ $match: priceFilter }]
          : []),
        { $sort: sortOption },
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            products: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  _id: 1,
                  product_name: 1,
                  product_image: 1,
                  isWishlist: 1,
                  totalAmount: 1,
                  discountedAmount: 1,
                  baseMetalValue: 1,
                  latestMetalPrice: 1,
                  netWeight: 1,
                  bestSeller: 1,
                  discountDifference: 1,
                },
              },
            ],
          },
        },
        { $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true } },
      ];

      const result = await ProductModel.aggregate(aggregationPipeline);

      const products = result[0]?.products || [];
      const totalCount = result[0]?.metadata?.totalCount || 0;

      return {
        products,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error("Error in getProductBySubcategory:", error);
      throw new Error("Error fetching products by subcategory");
    }
  }

  // async getProductByCategory(category, page, limit, userId, filters) {
  //   try {
  //     const skip = (page - 1) * limit;
  //     const sortOption = filters?.sort || { createdAt: -1 };
  //     const priceFilter = filters?.priceFilter || {};

  //     const aggregationPipeline = [
  //       { $match: { id_category: category, active: true, is_deleted: false } },
  //       {
  //         $lookup: {
  //           from: "wishlists",
  //           let: {
  //             productId: "$_id",
  //             customerId: userId ? { $toString: userId } : null,
  //           },
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: {
  //                   $and: [
  //                     {
  //                       $eq: [
  //                         "$id_customer",
  //                         new mongoose.Types.ObjectId(userId),
  //                       ],
  //                     },
  //                     { $eq: ["$itemId", "$$productId"] },
  //                   ],
  //                 },
  //               },
  //             },
  //           ],
  //           as: "wishlistInfo",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           isWishlist: { $gt: [{ $size: "$wishlistInfo" }, 0] },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "metalrates",
  //           let: { metalId: "$id_metal", purityId: "$id_purity",branchId: "$id_branch" },
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: {
  //                   $and: [
  //                     { $eq: ["$material_type_id", "$$metalId"] },
  //                     { $eq: ["$purity_id", "$$purityId"] },
  //                     { $eq: ["$id_branch", "$$branchId"] },
  //                   ],
  //                 },
  //               },
  //             },
  //             { $sort: { createdAt: -1 } },
  //             { $limit: 1 },
  //           ],
  //           as: "metalPriceInfo",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "stonedetails",
  //           localField: "stoneDetails",
  //           foreignField: "_id",
  //           as: "stoneDiamondDetails",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           latestMetalPrice: {
  //             $ifNull: [{ $arrayElemAt: ["$metalPriceInfo.rate", 0] }, 0],
  //           },
  //           netWeight: {
  //             $ifNull: ["$netWeight", "$grossWt"],
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           baseMetalValue: {
  //             $multiply: [
  //               { $ifNull: ["$netWeight", 0] },
  //               { $ifNull: ["$latestMetalPrice", 0] },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           rawMakingCharge: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: { $eq: ["$makingCharges.mode", 1] },
  //                   then: { $ifNull: ["$makingCharges.actualValue", 0] },
  //                 },
  //                 {
  //                   case: { $eq: ["$makingCharges.mode", 2] },
  //                   then: {
  //                     $multiply: [
  //                       { $ifNull: ["$grossWt", 0] },
  //                       { $ifNull: ["$makingCharges.actualValue", 0] },
  //                     ],
  //                   },
  //                 },
  //               ],
  //               default: 0,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           finalMakingCharge: {

  //                 $switch: {
  //                   branches: [
  //                     {
  //                       case: { $eq: ["$makingCharges.mode", 1] },
  //                       then: {
  //                         $ifNull: ["$makingCharges.discountedValue", 0],
  //                       },
  //                     },
  //                     {
  //                       case: { $eq: ["$makingCharges.mode", 2] },
  //                       then: {
  //                         $multiply: [
  //                           { $ifNull: ["$grossWt", 0] },
  //                           { $ifNull: ["$makingCharges.discountedValue", 0] },
  //                         ],
  //                       },
  //                     },
  //                   ],
  //                   default: 0,
  //                 },

  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           rawWastageCharge: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: { $eq: ["$wastageCharges.mode", 1] },
  //                   then: { $ifNull: ["$wastageCharges.actualValue", 0] },
  //                 },
  //                 {
  //                   case: { $eq: ["$wastageCharges.mode", 2] },
  //                   then: {
  //                     $multiply: [
  //                       { $ifNull: ["$grossWt", 0] },
  //                       { $ifNull: ["$wastageCharges.actualValue", 0] },
  //                     ],
  //                   },
  //                 },
  //               ],
  //               default: 0,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           finalWastageCharge: {

  //                 $switch: {
  //                   branches: [
  //                     {
  //                       case: { $eq: ["$wastageCharges.mode", 1] },
  //                       then: {
  //                         $ifNull: ["$wastageCharges.discountedValue", 0],
  //                       },
  //                     },
  //                     {
  //                       case: { $eq: ["$wastageCharges.mode", 2] },
  //                       then: {
  //                         $multiply: [
  //                           { $ifNull: ["$grossWt", 0] },
  //                           { $ifNull: ["$wastageCharges.discountedValue", 0] },
  //                         ],
  //                       },
  //                     },
  //                   ],
  //                   default: 0,
  //                 },

  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           diamondValue: {
  //             $sum: {
  //               $map: {
  //                 input: {
  //                   $filter: {
  //                     input: "$stoneDiamondDetails",
  //                     as: "sd",
  //                     cond: { $eq: ["$$sd.type", "diamond"] },
  //                   },
  //                 },
  //                 as: "diamond",
  //                 in: { $ifNull: ["$$diamond.price", 0] },
  //               },
  //             },
  //           },
  //           stoneValue: {
  //             $sum: {
  //               $map: {
  //                 input: {
  //                   $filter: {
  //                     input: "$stoneDiamondDetails",
  //                     as: "sd",
  //                     cond: { $eq: ["$$sd.type", "stone"] },
  //                   },
  //                 },
  //                 as: "stone",
  //                 in: { $ifNull: ["$$stone.price", 0] },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           discountedSubtotal: {
  //             $add: [
  //               { $ifNull: ["$baseMetalValue", 0] },
  //               { $ifNull: ["$finalWastageCharge", 0] },
  //               { $ifNull: ["$finalMakingCharge", 0] },
  //               { $ifNull: ["$diamondValue", 0] },
  //               { $ifNull: ["$stoneValue", 0] },
  //             ],
  //           },
  //           actualSubtotal: {
  //             $add: [
  //               { $ifNull: ["$baseMetalValue", 0] },
  //               { $ifNull: ["$rawWastageCharge", 0] },
  //               { $ifNull: ["$rawMakingCharge", 0] },
  //               { $ifNull: ["$diamondValue", 0] },
  //               { $ifNull: ["$stoneValue", 0] },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           gstRate: {
  //             $cond: {
  //               if: {
  //                 $and: [
  //                   { $gt: ["$gst", 0] },
  //                   { $gt: ["$discountedSubtotal", 0] },
  //                 ],
  //               },
  //               then: {
  //                 $divide: [
  //                   { $multiply: ["$discountedSubtotal", "$gst"] },
  //                   100,
  //                 ],
  //               },
  //               else: 0,
  //             },
  //           },
  //         },
  //       },
  //        {
  //         $addFields: {
  //           actualGstRate: {
  //             $cond: {
  //               if: {
  //                 $and: [
  //                   { $gt: ["$gst", 0] },
  //                   { $gt: ["$actualSubtotal", 0] },
  //                 ],
  //               },
  //               then: {
  //                 $divide: [
  //                   { $multiply: ["$actualSubtotal", "$gst"] },
  //                   100,
  //                 ],
  //               },
  //               else: 0,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           discountedAmount: {

  //                 $add: [
  //                   { $ifNull: ["$discountedSubtotal", 0] },
  //                   { $ifNull: ["$gstRate", 0] },
  //                 ],

  //           },
  //           totalAmount: {

  //                 $add: [
  //                   { $ifNull: ["$actualSubtotal", 0] },
  //                   { $ifNull: ["$actualGstRate", 0] },
  //                 ],

  //           },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           discountDifference: {

  //                 $subtract: [
  //                   { $ifNull: ["$totalAmount", 0] },
  //                   { $ifNull: ["$discountedAmount", 0] },
  //                 ],

  //           },
  //           discountPercentage: {

  //                 $multiply: [
  //                   {
  //                     $divide: [
  //                       {
  //                         $subtract: [
  //                           { $ifNull: ["$totalAmount", 0] },
  //                           { $ifNull: ["$discountedAmount", 0] },
  //                         ],
  //                       },
  //                       { $max: [{ $ifNull: ["$totalAmount", 1] }, 1] },
  //                     ],
  //                   },
  //                   100,
  //                 ],

  //           },
  //         },
  //       },
  //       ...(Object.keys(priceFilter).length > 0
  //         ? [{ $match: priceFilter }]
  //         : []),
  //       { $sort: sortOption },
  //       {
  //         $facet: {
  //           metadata: [{ $count: "totalCount" }],
  //           products: [
  //             { $skip: skip },
  //             { $limit: limit },
  //             {
  //               $project: {
  //                 _id: 1,
  //                 product_name: 1,
  //                 product_image: 1,
  //                 isWishlist: 1,
  //                 totalAmount: 1,
  //                 discountedAmount: 1,
  //                 bestSeller: 1,
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$metadata",
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //     ];

  //     const result = await ProductModel.aggregate(aggregationPipeline);

  //     const products = result[0]?.products || [];
  //     const totalCount = result[0]?.metadata?.totalCount || 0;

  //     return {
  //       products,
  //       totalCount,
  //       totalPages: Math.ceil(totalCount / limit),
  //       currentPage: page,
  //       hasNext: page < Math.ceil(totalCount / limit),
  //       hasPrev: page > 1,
  //     };
  //   } catch (error) {
  //     console.error("Error fetching products by category:", error);
  //     throw new Error("Error fetching products by category");
  //   }
  // }

  async getCategoryByCollectionId(id) {
    try {
      const categoryIds = await ProductModel.distinct("id_category", {
        collection: { $in: [id] },
        active: true,
        is_deleted: false,
      });

      if (!categoryIds || categoryIds.length === 0) {
        return null;
      }

      const categories = await categoryModel
        .find(
          { _id: { $in: categoryIds }, active: true },
          { _id: 1, category_name: 1, image: 1, pathUrl: 1, categoryBanner: 1 },
        )
        .lean();

      return categories;
    } catch (error) {
      console.error("Error in getCategoryByCollectionId:", error);
      throw error;
    }
  }

  // async getProductStockReport(page, limit, filter = {}) {
  //   try {
  //     const skip = (page - 1) * limit;

  //     const query = {
  //       active: true,
  //       is_deleted: false,
  //       ...filter,
  //     };
  //     // Get total count first
  //     const totalCount = await ProductModel.countDocuments(query);

  //     // Get products with pagination and populate category
  //     const products = await ProductModel.find(query)
  //       .populate("id_category", "category_name")
  //       .select("product_name sku code id_category quantity availableSizes")
  //       .skip(skip)
  //       .limit(limit)
  //       .lean();

  //     // Format the response
  //     const formattedProducts = products.map((product) => {
  //       let totalStock = product.quantity || 0;
  //       let sizeDetails = [];

  //       if (product.availableSizes && product.availableSizes.values) {
  //         // totalStock = product.availableSizes.values.reduce((sum, size) => sum + (size.quantity || 0), 0);
  //         sizeDetails = product.availableSizes.values.map((size) => ({
  //           sizeValue: size.sizeValue,
  //           quantity: size.quantity,
  //         }));
  //       }

  //       return {
  //         _id: product._id,
  //         product_name: product.product_name,
  //         sku: product.sku,
  //         category_name: product.id_category?.category_name || "N/A",
  //         size: sizeDetails,
  //         stock: sizeDetails,
  //         total_stock: totalStock,
  //       };
  //     });

  //     const totalPages = Math.ceil(totalCount / limit);

  //     return {
  //       products: formattedProducts,
  //       currentPage: page,
  //       totalPages,
  //       totalCount,
  //       hasNext: page < totalPages,
  //       hasPrev: page > 1,
  //     };
  //   } catch (error) {
  //     console.error("Error in getProductStockReport:", error);
  //     throw error;
  //   }
  // }

  // async getProductStockReport(page, limit, filter = {}) {
  //   try {
  //     const skip = (page - 1) * limit;
  //     console.log(filter);
  //     const query = {
  //       active: true,
  //       is_deleted: false,
  //       onlineProduct: true,
  //       ...filter,
  //     };

  //      const totalCountAggregation = await ProductModel.aggregate([
  //       { $match: query },
  //       { $unwind: "$availableSizes.values" },
  //       {
  //         $group: {
  //           _id: "$_id", // group back by productId
  //         },
  //       },
  //       { $count: "totalCount" },
  //     ]);

  //     const totalCount = totalCountAggregation[0]?.totalCount || 0;
  //     const totalPages = Math.ceil(totalCount / limit);
  //     const hasNext = page < totalPages;
  //     const hasPrev = page > 1;
  //     const products = await ProductModel.aggregate([
  //       { $match: query },

  //       // ✅ Expand availableSizes.values array
  //       { $unwind: "$availableSizes.values" },

  //       // ✅ Lookup from SizeMaster to get size unit
  //       {
  //         $lookup: {
  //           from: "sizemasters",
  //           localField: "availableSizes.sizeId",
  //           foreignField: "_id",
  //           as: "sizeInfo",
  //         },
  //       },
  //       { $unwind: { path: "$sizeInfo", preserveNullAndEmptyArrays: true } },

  //       // ✅ Lookup from Category to get category name
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "id_category",
  //           foreignField: "_id",
  //           as: "categoryInfo",
  //         },
  //       },
  //       {
  //         $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
  //       },
  //       {
  //         $lookup: {
  //           from: "subcategories",
  //           localField: "subcategoryId",
  //           foreignField: "_id",
  //           as: "subcategoriesInfo",
  //         },
  //       },
  //       {
  //         $unwind: { path: "$subcategoriesInfo", preserveNullAndEmptyArrays: true },
  //       },

  //       // ✅ Project necessary fields (including total product quantity)
  //       {
  //         $project: {
  //           productId: "$_id",
  //           product_name: 1,
  //           sku: 1,
  //           quantity: 1,
  //           createdAt: 1,
  //           categoryName: "$categoryInfo.category_name",
  //           subCategoryName: "$subcategoriesInfo.name",
  //           sizeId: "$availableSizes.sizeId",
  //           sizeValue: "$availableSizes.values.sizeValue",
  //           sizeQuantity: "$availableSizes.values.quantity",
  //           unit: "$sizeInfo.unit",
  //         },
  //       },

  //       // ✅ Group all sizes per product (store formatted array first)
  //       {
  //         $group: {
  //           _id: "$productId",
  //           product_name: { $first: "$product_name" },
  //           sku: { $first: "$sku" },
  //           createdAt: { $first: "$createdAt" },
  //           categoryName: { $first: "$categoryName" },
  //           subCategoryName: { $first: "$subCategoryName" },
  //           totalQuantity: { $first: "$quantity" },
  //           sizesArray: {
  //             $push: {
  //               $concat: [
  //                 { $toString: "$sizeValue" },
  //                 " ",
  //                 "$unit",
  //                 " (",
  //                 { $toString: "$sizeQuantity" },
  //                 ")",
  //               ],
  //             },
  //           },
  //         },
  //       },

  //       // ✅ Convert array into a single comma-separated string
  //       {
  //         $addFields: {
  //           sizes: {
  //             $reduce: {
  //               input: "$sizesArray",
  //               initialValue: "",
  //               in: {
  //                 $concat: [
  //                   {
  //                     $cond: [
  //                       { $eq: ["$$value", ""] },
  //                       "",
  //                       { $concat: ["$$value", ", "] },
  //                     ],
  //                   },
  //                   "$$this",
  //                 ],
  //               },
  //             },
  //           },
  //         },
  //       },

  //       // ✅ Final projection
  //       {
  //         $project: {
  //           _id: 0,
  //           productId: "$_id",
  //           product_name: 1,
  //           sku: 1,
  //           categoryName: 1,
  //           subCategoryName: 1,
  //           totalQuantity: 1,
  //           sizes: 1,
  //         },
  //       },

  //       // ✅ Sort & paginate
  //       { $sort: { createdAt: -1 } },
  //       { $skip: skip },
  //       { $limit: limit },
  //     ]);
  //     return {
  //       success: true,
  //       totalCount,
  //       totalPages,
  //       currentPage: page,
  //       hasNext,
  //       hasPrev,
  //       count: products.length,
  //       data: products,
  //     };
  //   } catch (error) {
  //     console.error("Error in getProductStockReport:", error);
  //     throw error;
  //   }
  // }


  async getProductStockReport(page, limit, filter = {}) {
    try {
      const skip = (page - 1) * limit;

      const query = {
        active: true,
        is_deleted: false,
        onlineProduct: true,
        ...filter,
      };

      // ---------------- COUNT ----------------
      const totalCountAgg = await ProductModel.aggregate([
        { $match: query },
        { $unwind: "$availableSizes.values" },
        {
          $group: { _id: "$_id" },
        },
        { $count: "totalCount" },
      ]);

      const totalCount = totalCountAgg[0]?.totalCount || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      // ---------------- DATA PIPELINE ----------------
      const products = await ProductModel.aggregate([
        { $match: query },

        { $unwind: "$availableSizes.values" },

        {
          $lookup: {
            from: "sizemasters",
            localField: "availableSizes.sizeId",
            foreignField: "_id",
            as: "sizeInfo",
          },
        },
        { $unwind: { path: "$sizeInfo", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
        },

        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoriesInfo",
          },
        },
        {
          $unwind: {
            path: "$subcategoriesInfo",
            preserveNullAndEmptyArrays: true,
          },
        },

        // IMPORTANT: include createdAt BEFORE grouping
        {
          $project: {
            productId: "$_id",
            product_name: 1,
            sku: 1,
            quantity: 1,
            createdAt: 1,
            categoryName: "$categoryInfo.category_name",
            subCategoryName: "$subcategoriesInfo.name",
            sizeValue: "$availableSizes.values.sizeValue",
            sizeQuantity: "$availableSizes.values.quantity",
            unit: "$sizeInfo.unit",
          },
        },

        {
          $group: {
            _id: "$productId",
            product_name: { $first: "$product_name" },
            sku: { $first: "$sku" },
            createdAt: { $first: "$createdAt" }, // preserve createdAt
            categoryName: { $first: "$categoryName" },
            subCategoryName: { $first: "$subCategoryName" },
            totalQuantity: { $first: "$quantity" },
            sizesArray: {
              $push: {
                $concat: [
                  { $toString: "$sizeValue" },
                  " ",
                  "$unit",
                  " (",
                  { $toString: "$sizeQuantity" },
                  ")",
                ],
              },
            },
          },
        },

        {
          $addFields: {
            sizes: {
              $reduce: {
                input: "$sizesArray",
                initialValue: "",
                in: {
                  $concat: [
                    {
                      $cond: [
                        { $eq: ["$$value", ""] },
                        "",
                        { $concat: ["$$value", ", "] },
                      ],
                    },
                    "$$this",
                  ],
                },
              },
            },
          },
        },

        {
          $project: {
            _id: 0,
            productId: "$_id",
            product_name: 1,
            sku: 1,
            categoryName: 1,
            subCategoryName: 1,
            totalQuantity: 1,
            sizes: 1,
            createdAt: 1, // MUST be kept here!
          },
        },

        // Final stable sorting
        { $sort: { createdAt: -1, product_name: 1 } },

        { $skip: skip },
        { $limit: limit },
      ]);

      return {
        success: true,
        totalCount,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        count: products.length,
        data: products,
      };
    } catch (error) {
      console.error("Error in getProductStockReport:", error);
      throw error;
    }
  }

  async getProductLowStockReport(page, limit, filter = {}) {
    try {
      const skip = (page - 1) * limit;
      console.log(filter);
      const query = {
        active: true,
        is_deleted: false,
        onlineProduct: true,
        ...filter,
      };

      const totalCountAggregation = await ProductModel.aggregate([
        { $match: query },
        { $unwind: "$availableSizes.values" },
        {
          $group: {
            _id: "$_id", // group back by productId
          },
        },
        { $count: "totalCount" },
      ]);

      const totalCount = totalCountAggregation[0]?.totalCount || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;
      const products = await ProductModel.aggregate([
        { $match: query },

        // ✅ Expand availableSizes.values array
        { $unwind: "$availableSizes.values" },

        // ✅ Lookup from SizeMaster to get size unit
        {
          $lookup: {
            from: "sizemasters",
            localField: "availableSizes.sizeId",
            foreignField: "_id",
            as: "sizeInfo",
          },
        },
        { $unwind: { path: "$sizeInfo", preserveNullAndEmptyArrays: true } },

        // ✅ Lookup from Category to get category name
        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
        },

        // ✅ Project necessary fields (including total product quantity)
        {
          $project: {
            productId: "$_id",
            product_name: 1,
            sku: 1,
            quantity: 1,
            categoryName: "$categoryInfo.category_name",
            sizeId: "$availableSizes.sizeId",
            sizeValue: "$availableSizes.values.sizeValue",
            sizeQuantity: "$availableSizes.values.quantity",
            unit: "$sizeInfo.unit",
          },
        },

        // ✅ Group all sizes per product (store formatted array first)
        {
          $group: {
            _id: "$productId",
            product_name: { $first: "$product_name" },
            sku: { $first: "$sku" },
            categoryName: { $first: "$categoryName" },
            totalQuantity: { $first: "$quantity" },
            sizesArray: {
              $push: {
                $concat: [
                  { $toString: "$sizeValue" },
                  " ",
                  "$unit",
                  " (",
                  { $toString: "$sizeQuantity" },
                  ")",
                ],
              },
            },
          },
        },

        // ✅ Convert array into a single comma-separated string
        {
          $addFields: {
            sizes: {
              $reduce: {
                input: "$sizesArray",
                initialValue: "",
                in: {
                  $concat: [
                    {
                      $cond: [
                        { $eq: ["$$value", ""] },
                        "",
                        { $concat: ["$$value", ", "] },
                      ],
                    },
                    "$$this",
                  ],
                },
              },
            },
          },
        },

        // ✅ Final projection
        {
          $project: {
            _id: 0,
            productId: "$_id",
            product_name: 1,
            sku: 1,
            categoryName: 1,
            totalQuantity: 1,
            sizes: 1,
          },
        },

        // ✅ Sort & paginate
        { $sort: { totalQuantity: 1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
      console.log(products);
      return {
        success: true,
        totalCount,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        count: products.length,
        data: products,
      };
    } catch (error) {
      console.error("Error in getProductLowStockReport:", error);
      throw error;
    }
  }

  async toggleBestSeller(id, currentstatus) {
    try {
      const updateStatus = await ProductModel.updateOne(
        { _id: id },
        { bestSeller: !currentstatus },
      );
      if (updateStatus.modifiedCount == 1) {
        return updateStatus;
      }
      return null;
    } catch (err) {
      console.error(err);
      throw new Error("Database error occurred while changing product status");
    }
  }

  //   async allProductsData(filter, skip, limit, searchOptions, customerId = null) {
  //     try {
  //       console.log("Filter received in allProductsData:", filter,search);
  //       const pipeline = [
  //         { $match: filter },
  //         {
  //           $lookup: {
  //             from: "branches",
  //             localField: "id_branch",
  //             foreignField: "_id",
  //             as: "id_branch",
  //           },
  //         },
  //         { $unwind: { path: "$id_branch", preserveNullAndEmptyArrays: true } },
  //         {
  //           $lookup: {
  //             from: "categories",
  //             localField: "id_category",
  //             foreignField: "_id",
  //             as: "id_category",
  //           },
  //         },
  //         { $unwind: { path: "$id_category", preserveNullAndEmptyArrays: true } },
  // {
  //   $lookup: {
  //     from: "subcategories",
  //     localField: "subcategoryId",
  //     foreignField: "_id",
  //     as: "subcategory"
  //   }
  // },
  // { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },

  // // Collection lookup
  // {
  //   $lookup: {
  //     from: "collections",
  //     localField: "collection",
  //     foreignField: "_id",
  //     as: "collectionData"
  //   }
  // },
  // { $unwind: { path: "$collectionData", preserveNullAndEmptyArrays: true } },
  //         {
  //           $lookup: {
  //             from: "metals",
  //             localField: "id_metal",
  //             foreignField: "_id",
  //             as: "id_metal",
  //           },
  //         },
  //         { $unwind: { path: "$id_metal", preserveNullAndEmptyArrays: true } },
  //         {
  //           $lookup: {
  //             from: "purities",
  //             localField: "id_purity",
  //             foreignField: "_id",
  //             as: "id_purity",
  //           },
  //         },
  //         { $unwind: { path: "$id_purity", preserveNullAndEmptyArrays: true } },
  //         {
  //           $lookup: {
  //             from: "s3bucketsettings",
  //             localField: "id_branch._id",
  //             foreignField: "id_branch",
  //             as: "s3Details",
  //           },
  //         },
  //         { $unwind: { path: "$s3Details", preserveNullAndEmptyArrays: true } },

  //         ...(customerId
  //           ? [
  //               {
  //                 $lookup: {
  //                   from: "wishlists",
  //                   let: { productId: "$_id" },
  //                   pipeline: [
  //                     {
  //                       $match: {
  //                         $expr: {
  //                           $and: [
  //                             { $eq: ["$itemId", "$$productId"] },
  //                             {
  //                               $eq: [
  //                                 "$id_customer",
  //                                 new mongoose.Types.ObjectId(customerId),
  //                               ],
  //                             },
  //                           ],
  //                         },
  //                       },
  //                     },
  //                   ],
  //                   as: "wishlistMatch",
  //                 },
  //               },
  //               {
  //                 $addFields: {
  //                   isWishlisted: {
  //                     $gt: [{ $size: "$wishlistMatch" }, 0],
  //                   },
  //                 },
  //               },
  //             ]
  //           : [
  //               {
  //                 $addFields: {
  //                   isWishlisted: false,
  //                 },
  //               },
  //             ]),
  //       ];
  //       if (searchOptions && searchOptions.term) {
  //         const searchWords = searchOptions.term
  //           .split(/\s+|[()]/g)
  //           .filter((word) => word.length > 0);
  //         const orConditions = [];

  //         searchWords.forEach((word) => {
  //           const wordRegex = new RegExp(
  //             word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  //             "i"
  //           );

  //           orConditions.push(
  //             { product_name: { $regex: wordRegex } },
  //             { description: { $regex: wordRegex } },
  //             { code: { $regex: wordRegex } },
  //             { sku: { $regex: wordRegex } },
  //             { "id_branch.branch_name": { $regex: wordRegex } },
  //             { "id_category.category_name": { $regex: wordRegex } },
  //             { "subcategory.name": { $regex: wordRegex } }, // after lookup
  //             { "id_metal.metal_name": { $regex: wordRegex } },
  //             { "id_purity.purity_name": { $regex: wordRegex } },
  //             { "collectionData.name": { $regex: wordRegex } }, // after lookup
  //             { "stoneDetails.stoneName": { $regex: wordRegex } }
  //           );
  //         });

  //         if (!isNaN(searchOptions.term)) {
  //           const numSearch = parseFloat(searchOptions.term);
  //           orConditions.push({ weight: numSearch });
  //         }

  //         const momentDate = moment(
  //           searchOptions.term,
  //           ["DD/MM/YYYY", "YYYY-MM-DD"],
  //           true
  //         );
  //         if (momentDate.isValid()) {
  //           const startOfDay = momentDate.startOf("day").toDate();
  //           const endOfDay = momentDate.endOf("day").toDate();

  //           orConditions.push({
  //             createdAt: { $gte: startOfDay, $lte: endOfDay },
  //           });
  //         }

  //         pipeline.push({
  //           $match: { $or: orConditions },
  //         });
  //       }

  //       pipeline.push(
  //         { $skip: skip },
  //         { $limit: limit },
  //         {
  //           $project: {
  //             product_name: 1,
  //             weight: 1,
  //             createdAt: 1,
  //             product_image: 1,
  //             active: 1,
  //             bestSeller: "$bestSeller",
  //             branchName: "$id_branch.branch_name",
  //             metalName: "$id_metal.metal_name",
  //             purityName: "$id_purity.purity_name",
  //             isWishlisted: 1,
  //             weight: "$quantity",
  //             pathurl: {
  //               $concat: [
  //                 "$s3Details.s3display_url",
  //                 "aupay/webadmin/assets/products/",
  //               ],
  //             },
  //           },
  //         }
  //       );

  //       const products = await ProductModel.aggregate(pipeline);
  //       return products;
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }


  async allProductsData(filter, skip, limit, searchOptions, customerId = null) {
    try {
      console.log("Filter received in allProductsData:", filter, searchOptions);

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
            as: "subcategory",
          },
        },
        { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "collections",
            localField: "collection",
            foreignField: "_id",
            as: "collectionData",
          },
        },
        {
          $unwind: {
            path: "$collectionData",
            preserveNullAndEmptyArrays: true,
          },
        },
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
            from: "purities",
            localField: "id_purity",
            foreignField: "_id",
            as: "id_purity",
          },
        },
        { $unwind: { path: "$id_purity", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "s3bucketsettings",
            localField: "id_branch._id",
            foreignField: "id_branch",
            as: "s3Details",
          },
        },
        { $unwind: { path: "$s3Details", preserveNullAndEmptyArrays: true } },

        ...(customerId
          ? [
              {
                $lookup: {
                  from: "wishlists",
                  let: { productId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$itemId", "$$productId"] },
                            {
                              $eq: [
                                "$id_customer",
                                new mongoose.Types.ObjectId(customerId),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "wishlistMatch",
                },
              },
              {
                $addFields: {
                  isWishlisted: {
                    $gt: [{ $size: "$wishlistMatch" }, 0],
                  },
                },
              },
            ]
          : [
              {
                $addFields: {
                  isWishlisted: false,
                },
              },
            ]),
      ];

      if (searchOptions && searchOptions.term) {
        const searchTerm = searchOptions.term.trim();

        const searchRegex = new RegExp(
          searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        );

        const numericSearch = !isNaN(searchTerm)
          ? parseFloat(searchTerm)
          : null;

        const searchConditions = [];

        if (searchTerm.length > 0) {
          searchConditions.push({
            $or: [
              { product_name: { $regex: searchRegex } },
              { description: { $regex: searchRegex } },
              { code: { $regex: searchRegex } },
              { sku: { $regex: searchRegex } },
              { "id_branch.branch_name": { $regex: searchRegex } },
              { "id_category.category_name": { $regex: searchRegex } },
              { "subcategory.name": { $regex: searchRegex } },
              { "id_metal.metal_name": { $regex: searchRegex } },
              { "id_purity.purity_name": { $regex: searchRegex } },
              { "collectionData.name": { $regex: searchRegex } },
              // { "stoneDetails.stoneName": { $regex: searchRegex } }
            ],
          });
        }

        if (numericSearch !== null) {
          searchConditions.push({ weight: numericSearch });
        }

        if (searchConditions.length > 0) {
          pipeline.push({
            $match:
              searchConditions.length === 1
                ? searchConditions[0]
                : { $or: searchConditions },
          });
        }
      }

      pipeline.push(
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            product_name: 1,
            weight: 1,
            createdAt: 1,
            product_image: 1,
            active: 1,
            bestSeller: "$bestSeller",
            branchName: "$id_branch.branch_name",
            metalName: "$id_metal.metal_name",
            purityName: "$id_purity.purity_name",
            isWishlisted: 1,
            weight: "$quantity",
            pathurl: {
              $concat: [
                "$s3Details.s3display_url",
                `${config?.AWS_LOCAL_PATH}products/`,
              ],
            },
          },
        },
      );

      const products = await ProductModel.aggregate(pipeline);
      return products;
    } catch (err) {
      console.error("Error in allProductsData:", err);
      throw err;
    }
  }

  async reduceProductQuantity(productId, sizeId, quantityToReduce) {
    try {
      const result = await ProductModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(productId),
          "availableSizes.values._id": new mongoose.Types.ObjectId(sizeId),
          "availableSizes.values.quantity": { $gte: quantityToReduce },
        },
        {
          $inc: {
            quantity: -quantityToReduce,
            "availableSizes.values.$.quantity": -quantityToReduce,
          },
        },
      );

      if (result.modifiedCount === 0) {
        return {
          success: false,
          message:
            "Failed to reduce product quantity. Product/size not found or insufficient stock.",
        };
      }

      return { success: true, message: "Quantity reduced successfully." };
    } catch (error) {
      console.error("Error reducing product quantity:", error);
      throw new Error(
        "Database error occurred while reducing product quantity.",
      );
    }
  }

  async findProductForOrderNow(productId, userId) {
    try {
      const result = await OrderItem.aggregate([
        {
          $match: {
            productId: new mongoose.Types.ObjectId(productId),
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "orderId",
            foreignField: "_id",
            as: "Order",
          },
        },
        { $unwind: "$Order" },
        {
          $match: {
            "Order.userId": new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            _id: 0,
            orderId: "$Order._id",
            onlineProduct: "$Order.orderType",
            orderStatus: "$Order.orderStatus",
          },
        },
      ]);
      if (!result.length) {
        // no previous order found for this product
        return { alreadyOrdered: false, orderId: null };
      }
      const hasActiveOrder = result.some(
        (item) =>
          item.onlineProduct === ORDER_TYPE.OFFLINE_ORDER &&
          item.orderStatus === ORDER_STATUS_NO.PROCESSING,
      );
      // If has active order → user already ordered → return true
      return {
        alreadyOrdered: hasActiveOrder,
        orderId: hasActiveOrder
          ? result.find(
              (r) =>
                r.onlineProduct === ORDER_TYPE.OFFLINE_ORDER &&
                r.orderStatus === ORDER_STATUS_NO.PROCESSING,
            )?.orderId
          : null,
      };
    } catch (error) {
      throw error;
    }
  }

  async checkQuantityAvailability(productData) {
    console.log(productData);
    try {
      if (!Array.isArray(productData) || productData.length === 0) {
        throw new Error("Invalid product data");
      }

      // 1️⃣ Extract product IDs
      const productIds = productData.map(
        (item) => new mongoose.Types.ObjectId(item.productId),
      );
      console.log("1234567890-", productIds);

      // 2️⃣ Fetch products (only needed fields)
      const products = await ProductModel.find(
        { _id: { $in: productIds } },
        { product_name: 1, availableSizes: 1 },
      ).lean();

      // 3️⃣ Map + check stock
      const results = productData.map(
        ({ productId, sizeId, quantity, qty }) => {
          const product = products.find((p) => p._id.toString() === productId);
          if (!product) {
            return {
              productId: productId,
              sizeId,
              isStockIn: false,
              reason: "Product not found",
            };
          }

          // ✅ Use availableSizes directly (no `.values`)
          const matchedSize = product.availableSizes?.values?.find(
            (s) => s?._id?.toString() === sizeId,
          );
          const quantityCount = Number(quantity ?? qty) || 0; // ✅ Always numeric
          console.log("quantityCount", quantityCount);
          return {
            productName: product.product_name,
            sizeId,
            isStockIn: matchedSize
              ? matchedSize.quantity >= quantityCount
              : false,
          };
        },
      );

      // 4️⃣ Only return products where stock is false
      const outOfStockResults = results.filter((r) => !r.isStockIn);

      return outOfStockResults;
    } catch (error) {
      console.error("❌ Error in checkQuantityAvailability:", error);
      throw new Error(error.message || "Error checking quantity availability");
    }
  }

  async findByField(field) {
    try {
      return ProductModel.findOne(field).lean();
    } catch (error) {
      throw new Error(error.message || "Error Find By Field");
    }
  }

  async getProductByCategory(category, page, limit, userId, filters = {}) {
    try {
      // ================= SAFE PAGINATION =================
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const skip = (page - 1) * limit;

      const sortOption =
        filters?.sort === "price_low"
          ? { discountedAmount: 1 }
          : filters?.sort === "price_high"
            ? { discountedAmount: -1 }
            : { createdAt: -1 };

      const aggregationPipeline = [
        // ================= MATCH PRODUCT =================
        {
          $match: {
            id_category: new mongoose.Types.ObjectId(category),
            active: true,
            is_deleted: false,
          },
        },

        // ================= WISHLIST =================
        {
          $lookup: {
            from: "wishlists",
            let: { productId: "$_id" },
            pipeline: userId
              ? [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: [
                              "$id_customer",
                              new mongoose.Types.ObjectId(userId),
                            ],
                          },
                          { $eq: ["$itemId", "$$productId"] },
                        ],
                      },
                    },
                  },
                ]
              : [],
            as: "wishlistInfo",
          },
        },

        {
          $addFields: {
            isWishlist: userId
              ? { $gt: [{ $size: "$wishlistInfo" }, 0] }
              : false,
          },
        },

        // ================= LOOKUP ITEMS =================
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

              // ================= BASE METAL VALUE =================
              {
                $addFields: {
                  baseMetalValue: {
                    $multiply: [
                      { $ifNull: ["$currentMetalRate", 0] },
                      { $ifNull: ["$netWeight", 0] },
                    ],
                  },
                },
              },

              // ================= MAKING =================
              {
                $addFields: {
                  actualMaking: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$makingCharges.makingMode", 1] },
                          then: {
                            $ifNull: ["$makingCharges.makingActualValue", 0],
                          },
                        },
                        {
                          case: { $eq: ["$makingCharges.makingMode", 2] },
                          then: {
                            $multiply: [
                              {
                                $cond: [
                                  {
                                    $eq: ["$makingCharges.calculationType", 1],
                                  },
                                  "$grossWt",
                                  "$netWeight",
                                ],
                              },
                              {
                                $ifNull: [
                                  "$makingCharges.makingActualValue",
                                  0,
                                ],
                              },
                            ],
                          },
                        },
                      ],
                      default: 0,
                    },
                  },

                  discountedMaking: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$makingCharges.makingMode", 1] },
                          then: {
                            $ifNull: [
                              "$makingCharges.makingDiscountedValue",
                              0,
                            ],
                          },
                        },
                        {
                          case: { $eq: ["$makingCharges.makingMode", 2] },
                          then: {
                            $multiply: [
                              {
                                $cond: [
                                  {
                                    $eq: ["$makingCharges.calculationType", 1],
                                  },
                                  "$grossWt",
                                  "$netWeight",
                                ],
                              },
                              {
                                $ifNull: [
                                  "$makingCharges.makingDiscountedValue",
                                  0,
                                ],
                              },
                            ],
                          },
                        },
                      ],
                      default: 0,
                    },
                  },
                },
              },

              // ================= WASTAGE =================
              {
                $addFields: {
                  actualWastage: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$wastageCharges.wastageMode", 1] },
                          then: {
                            $ifNull: ["$wastageCharges.wastageActualValue", 0],
                          },
                        },
                        {
                          case: { $eq: ["$wastageCharges.wastageMode", 2] },
                          then: {
                            $multiply: [
                              {
                                $divide: [
                                  {
                                    $ifNull: [
                                      "$wastageCharges.wastageActualValue",
                                      0,
                                    ],
                                  },
                                  100,
                                ],
                              },
                              "$currentMetalRate",
                              {
                                $cond: [
                                  {
                                    $eq: ["$wastageCharges.calculationType", 1],
                                  },
                                  "$grossWt",
                                  "$netWeight",
                                ],
                              },
                            ],
                          },
                        },
                      ],
                      default: 0,
                    },
                  },

                  discountedWastage: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$wastageCharges.wastageMode", 1] },
                          then: {
                            $ifNull: [
                              "$wastageCharges.wastageDiscountedValue",
                              0,
                            ],
                          },
                        },
                        {
                          case: { $eq: ["$wastageCharges.wastageMode", 2] },
                          then: {
                            $multiply: [
                              {
                                $divide: [
                                  {
                                    $ifNull: [
                                      "$wastageCharges.wastageDiscountedValue",
                                      0,
                                    ],
                                  },
                                  100,
                                ],
                              },
                              "$currentMetalRate",
                              {
                                $cond: [
                                  {
                                    $eq: ["$wastageCharges.calculationType", 1],
                                  },
                                  "$grossWt",
                                  "$netWeight",
                                ],
                              },
                            ],
                          },
                        },
                      ],
                      default: 0,
                    },
                  },
                },
              },

              // ================= SUBTOTAL =================
              {
                $addFields: {
                  actualSubtotal: {
                    $add: [
                      "$baseMetalValue",
                      "$actualMaking",
                      "$actualWastage",
                    ],
                  },
                  discountedSubtotal: {
                    $add: [
                      "$baseMetalValue",
                      "$discountedMaking",
                      "$discountedWastage",
                    ],
                  },
                },
              },

              // ================= GST =================
              {
                $addFields: {
                  actualFinalPrice: {
                    $add: [
                      "$actualSubtotal",
                      {
                        $multiply: [
                          "$actualSubtotal",
                          { $divide: ["$gst", 100] },
                        ],
                      },
                    ],
                  },
                  discountedFinalPrice: {
                    $add: [
                      "$discountedSubtotal",
                      {
                        $multiply: [
                          "$discountedSubtotal",
                          { $divide: ["$gst", 100] },
                        ],
                      },
                    ],
                  },
                },
              },

              {
                $project: {
                  actualFinalPrice: 1,
                  discountedFinalPrice: 1,
                },
              },
            ],
            as: "items",
          },
        },

        // Remove products without items
        {
          $match: {
            "items.0": { $exists: true },
          },
        },

        // ================= PICK MIN VARIANT PRICE =================
        {
          $addFields: {
            totalAmount: { $min: "$items.actualFinalPrice" },
            discountedAmount: { $min: "$items.discountedFinalPrice" },
          },
        },

        // ================= SORT =================
        { $sort: sortOption },

        // ================= PAGINATION =================
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            products: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  _id: 1,
                  product_name: 1,
                  product_image: 1,
                  bestSeller: 1,
                  isWishlist: 1,
                  discountedAmount: 1,
                  totalAmount: 1,
                },
              },
            ],
          },
        },

        {
          $unwind: {
            path: "$metadata",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const result = await ProductModel.aggregate(aggregationPipeline);

      const products = result[0]?.products || [];
      const totalCount = result[0]?.metadata?.totalCount || 0;

      return {
        products,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error("Item-based pricing aggregation error:", error);
      throw new Error("Failed to fetch products with item pricing");
    }
  }
}

export default ProductRepository;
