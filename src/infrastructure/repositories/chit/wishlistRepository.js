import config from "../../../config/chit/env.js";
import wishlistModel from "../../models/chit/wishlistModel.js"
import mongoose from "mongoose";

class WishlistRepository{
    async findOne(query){
        try {
            const result = await wishlistModel.findOne(query)

            if(!result){
                return null
            }

            return result;
        } catch (error) {
            console.error(error)
        }
    }

    async find(query){
        try {
            const result = await wishlistModel.find(query)

            if(result.length == 0){
                return null
            }

            return result;
        } catch (error) {
            console.error(error)
        }
    }

    async addToWishlist(data){
        try {
            const result = await wishlistModel.create(data)

            if(!result){
                return null
            }

            return result;
        } catch (error) {
            console.error(error)
        }
    }

    async removedFromWishlist(query){
        try {
            const result = await wishlistModel.deleteOne(query)

            if(!result){
                return null
            }

            return result;
        } catch (error) {
            console.error(error)
        }
    }

     async getWishlist(id_customer) {
    try {
      const result = await wishlistModel.aggregate([
        {
          $match: { id_customer: new mongoose.Types.ObjectId(id_customer) }
        },
        {
          $lookup: {
            from: "products",
            localField: "itemId",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
  
        // Lookup latest metal rate
        {
          $lookup: {
            from: "metalrates",
            let: { metalId: "$product.id_metal", purityId: "$product.id_purity", id_branch: "$product.id_branch", },
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
  
        // Lookup stone/diamond details
        {
          $lookup: {
            from: "stonedetails",
            localField: "product.stoneDetails",
            foreignField: "_id",
            as: "stoneDiamondDetails",
          },
        },
        {
          $lookup: {
            from: "stone_masters",
            localField: "stoneDiamondDetails.itemId",
            foreignField: "_id",
            as: "stoneInfo",
          },
        },
        // {
        //   $unwind: {
        //     path: "$stoneInfo",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
  
        // Metal price
        {
          $addFields: {
            latestMetalPrice: {
              $ifNull: [{ $arrayElemAt: ["$metalPriceInfo.rate", 0] }, 0],
            },
          },
        },
  
        // Base metal value
        {
          $addFields: {
            baseMetalValue: {
              $multiply: [
                { $ifNull: ["$product.netWeight", 0] },
                { $ifNull: ["$latestMetalPrice", 0] },
              ],
            },
          },
        },
  
        // Raw making charge
        {
          $addFields: {
            rawMakingCharge: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$product.makingCharges.mode", 1] },
                    then: { $ifNull: ["$product.makingCharges.actualValue", 0] },
                  },
                  {
                    case: { $eq: ["$product.makingCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$product.grossWt", 0] },
                        { $ifNull: ["$product.makingCharges.actualValue", 0] },
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
                    case: { $eq: ["$product.wastageCharges.mode", 1] },
                    then: { $ifNull: ["$product.wastageCharges.actualValue", 0] },
                  },
                  {
                    case: { $eq: ["$product.wastageCharges.mode", 2] },
                    then: {
                      $multiply: [
                        { $ifNull: ["$product.grossWt", 0] },
                        { $ifNull: ["$product.wastageCharges.actualValue", 0] },
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
              $round: [
                {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$product.makingCharges.mode", 1] },
                        then: {
                          $ifNull: ["$product.makingCharges.discountedValue", 0],
                        },
                      },
                      {
                        case: { $eq: ["$product.makingCharges.mode", 2] },
                        then: {
                          $multiply: [
                            { $ifNull: ["$product.grossWt", 0] },
                            { $ifNull: ["$product.makingCharges.discountedValue", 0] },
                          ],
                        },
                      },
                    ],
                    default: 0,
                  },
                },
                2,
              ],
            },
            finalWastageCharge: {
              $round: [
                {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$product.wastageCharges.mode", 1] },
                        then: {
                          $ifNull: ["$product.wastageCharges.discountedValue", 0],
                        },
                      },
                      {
                        case: { $eq: ["$product.wastageCharges.mode", 2] },
                        then: {
                          $multiply: [
                            { $ifNull: ["$product.grossWt", 0] },
                            { $ifNull: ["$product.wastageCharges.discountedValue", 0] },
                          ],
                        },
                      },
                    ],
                    default: 0,
                  },
                },
                2,
              ],
            },
          },
        },
  
        // Diamond & Stone values
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
  
        // Subtotals
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
                    { $gt: ["$product.gst", 0] },
                    { $gt: ["$discountedSubtotal", 0] },
                  ],
                },
                then: {
                  $divide: [
                    { $multiply: ["$discountedSubtotal", "$product.gst"] },
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
                  $and: [
                    { $gt: ["$product.gst", 0] },
                    { $gt: ["$actualSubtotal", 0] },
                  ],
                },
                then: {
                  $divide: [
                    { $multiply: ["$actualSubtotal", "$product.gst"] },
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
            discountedAmount: {
              $round: [
                {
                  $add: [
                    { $ifNull: ["$discountedSubtotal", 0] },
                    { $ifNull: ["$gstRate", 0] },
                  ],
                },
                2,
              ],
            },
            totalAmount: {
              $round: [
                {
                  $add: [
                    { $ifNull: ["$actualSubtotal", 0] },
                    { $ifNull: ["$actualGstRate", 0] },
                  ],
                },
                2,
              ],
            },
          },
        },
  
        // Final projection (cleanup)
        {
          $project: {
            purity: 0,
            latestMetalPrice: 0,
            baseMetalValue: 0,
            rawMakingCharge: 0,
            finalMakingCharge: 0,
            finalWastageCharge: 0,
            rawWastageCharge: 0,
            diamondValue: 0,
            stoneValue: 0,
            discountedSubtotal: 0,
            actualSubtotal: 0,
            metalPriceInfo: 0,
            stoneDiamondDetails: 0,
            stoneInfo: 0
          }
        }
      ]);
  
      return result.length ? result : null;
    } catch (error) {
      console.error("Error in getWishlist (lookup):", error);
    }
  }
     
}

export default WishlistRepository;