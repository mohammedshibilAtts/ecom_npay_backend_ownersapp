import mongoose from "mongoose";

/**
 * Generates a reusable MongoDB aggregation pipeline for Item pricing.
 * Expects the input documents to be from the 'items' collection or 
 * have the same structure as the Item model.
 */
export const getPricingPipeline = (branchId, itemPrefix = "") => {
  const p = itemPrefix ? `${itemPrefix}.` : "";
  const $p = itemPrefix ? `$${itemPrefix}.` : "$";

  return [
    // 1. Lookup Latest Metal Rate (ONLY if not isMrp)
    {
      $lookup: {
        from: "metalrates",
        let: { purityId: `${$p}id_purity`, bId: { $toObjectId: branchId.startsWith("$") ? branchId : null }, isMrp: "$isMrp" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$isMrp", false] }, // Only match if not MRP
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
        currentRate: {
          $cond: {
            if: { $eq: ["$isMrp", true] },
            then: { $ifNull: [`${$p}currentMetalRate`, 0] },
            else: { $ifNull: [{ $arrayElemAt: ["$rateInfo.rate", 0] }, 0] },
          },
        },
      },
    },

    // 2. Lookup and Sum Stone Details
    {
      $lookup: {
        from: "stonedetails",
        localField: `${p}stoneDetails`,
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
        // Metal Value calculation
        // If isMrp is true, metalValue is just the rate. Else, it is grossWt * currentRate.
        metalValue: {
          $cond: {
            if: { $eq: ["$isMrp", true] },
            then: "$currentRate",
            else: {
              $multiply: [{ $ifNull: [`${$p}grossWt`, 0] }, "$currentRate"],
            },
          },
        },

        // Helper fields for weight bases based on calculationType (1 = grossWt, 2 = netWeight)
        makingWeightBase: {
          $cond: {
            if: { $eq: [`${$p}makingCharges.calculationType`, 1] },
            then: { $ifNull: [`${$p}grossWt`, 0] },
            else: { $ifNull: [`${$p}netWeight`, 0] },
          },
        },
        wastageWeightBase: {
          $cond: {
            if: { $eq: [`${$p}wastageCharges.calculationType`, 1] },
            then: { $ifNull: [`${$p}grossWt`, 0] },
            else: { $ifNull: [`${$p}netWeight`, 0] },
          },
        },

        // Helper fields for fallback amounts
        makingAmount: {
          $ifNull: [
            `${$p}makingCharges.makingDiscountedValue`,
            { $ifNull: [`${$p}makingCharges.makingActualValue`, 0] }
          ]
        },
        wastageAmount: {
          $ifNull: [
            `${$p}wastageCharges.wastageDiscountedValue`,
            { $ifNull: [`${$p}wastageCharges.wastageActualValue`, 0] }
          ]
        }
      },
    },
    {
      $addFields: {
        // Making Charges: Mode 1: Fixed Amount, Mode 2: Per Gram
        makingValue: {
          $cond: {
            if: { $eq: [`${$p}makingCharges.makingMode`, 1] },
            then: "$makingAmount",
            else: {
              $multiply: ["$makingWeightBase", "$makingAmount"],
            },
          },
        },

        // Wastage Charges: Mode 1: Fixed Amount, Mode 2: Percentage
        wastageValue: {
          $cond: {
            if: { $eq: [`${$p}wastageCharges.wastageMode`, 1] },
            then: "$wastageAmount",
            else: {
              $multiply: [
                { $divide: ["$wastageAmount", 100] },
                "$currentRate",
                "$wastageWeightBase",
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
            { $ifNull: [`${$p}huidCharges`, 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        gstAmount: {
          $divide: [{ $multiply: ["$subTotal", { $ifNull: [`${$p}gst`, 0] }] }, 100],
        },
      },
    },

    // 5. Final Result Fields
    {
      $addFields: {
        calculatedPrice: { $round: ["$subTotal", 2] },
        calculatedTotalPrice: { $round: [{ $add: ["$subTotal", "$gstAmount"] }, 2] },
      },
    },

    // Cleanup temporary fields
    {
      $project: {
        rateInfo: 0,
        stones: 0,
        makingWeightBase: 0,
        wastageWeightBase: 0,
        makingAmount: 0,
        wastageAmount: 0,
        subTotal: 0,
      },
    },
  ];
};

