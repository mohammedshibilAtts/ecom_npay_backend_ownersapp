import mongoose from "mongoose";

/**
 * Generates a reusable MongoDB aggregation pipeline for Item pricing.
 * Expects the input documents to be from the 'items' collection or 
 * have the same structure as the Item model.
 */
export const getPricingPipeline = (branchId) => {
  return [
    // 1. Lookup Latest Metal Rate
    {
      $lookup: {
        from: "metalrates",
        let: { purityId: "$id_purity", bId: { $toObjectId: branchId.startsWith("$") ? branchId : null } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$purity_id", "$$purityId"] },
                  {
                    $eq: [
                      "$id_branch",
                      branchId.startsWith("$") 
                        ? "$$bId" 
                        : (mongoose.Types.ObjectId.isValid(branchId) ? new mongoose.Types.ObjectId(branchId) : branchId)
                    ],
                  },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: "rateInfo",
      },
    },
    {
      $addFields: {
        currentRate: { $ifNull: [{ $arrayElemAt: ["$rateInfo.rate", 0] }, 0] },
      },
    },

    // 2. Lookup and Sum Stone Details
    {
      $lookup: {
        from: "stonedetails",
        localField: "stoneDetails",
        foreignField: "_id",
        as: "stones",
      },
    },
    {
      $addFields: {
        totalStoneValue: { $sum: "$stones.price" },
      },
    },

    // 3. Calculate Base Components
    {
      $addFields: {
        // Metal Value = netWeight * currentRate
        metalValue: {
          $multiply: [{ $ifNull: ["$netWeight", 0] }, "$currentRate"],
        },

        // Making Charges
        // Mode 1: Fixed Amount, Mode 2: Per Gram
        makingValue: {
          $cond: {
            if: { $eq: ["$makingCharges.makingMode", 1] },
            then: { $ifNull: ["$makingCharges.makingDiscountedValue", 0] },
            else: {
              $multiply: [
                { $ifNull: ["$netWeight", 0] },
                { $ifNull: ["$makingCharges.makingDiscountedValue", 0] },
              ],
            },
          },
        },

        // Wastage Charges
        // Mode 1: Fixed Amount, Mode 2: Percentage
        wastageValue: {
          $cond: {
            if: { $eq: ["$wastageCharges.wastageMode", 1] },
            then: { $ifNull: ["$wastageCharges.wastageDiscountedValue", 0] },
            else: {
              $multiply: [
                {
                  $divide: [
                    {
                      $multiply: [
                        { $ifNull: ["$netWeight", 0] },
                        { $ifNull: ["$wastageCharges.wastageDiscountedValue", 0] },
                      ],
                    },
                    100,
                  ],
                },
                "$currentRate",
              ],
            },
          },
        },
      },
    },

    // 4. Calculate Subtotal and GST
    {
      $addFields: {
        subTotal: {
          $add: [
            "$metalValue",
            "$makingValue",
            "$wastageValue",
            "$totalStoneValue",
            { $ifNull: ["$huidCharges", 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        gstAmount: {
          $divide: [{ $multiply: ["$subTotal", { $ifNull: ["$gst", 0] }] }, 100],
        },
      },
    },

    // 5. Final Result Fields
    {
      $addFields: {
        calculatedPrice: { $round: ["$subTotal", 2] },
        calculatedTotalPrice: { $round: [{ $add: ["$subTotal", "$gstAmount"] }, 0] },
      },
    },

    // Cleanup temporary fields
    {
      $project: {
        rateInfo: 0,
        stones: 0,
        metalValue: 0,
        makingValue: 0,
        wastageValue: 0,
        totalStoneValue: 0,
        subTotal: 0,
        gstAmount: 0,
      },
    },
  ];
};
