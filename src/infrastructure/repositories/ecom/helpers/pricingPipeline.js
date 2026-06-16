import mongoose from "mongoose";

export const getPricingPipeline = (branchId, itemPrefix = "") => {
  const p = itemPrefix ? `${itemPrefix}.` : "";
  const $p = itemPrefix ? `$${itemPrefix}.` : "$";

  return [
    {
      $lookup: {
        from: "metalrates",
        let: { purityId: `${$p}id_purity`, isMrp: "$isMrp" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$isMrp", false] },
                  { $eq: ["$purity_id", "$$purityId"] },
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
    {
      $addFields: {
        ...(itemPrefix
          ? {
              [`${itemPrefix}.currentMetalRate`]: {
                $cond: {
                  if: { $eq: ["$isMrp", false] },
                  then: "$currentRate",
                  else: `$${itemPrefix}.currentMetalRate`,
                },
              },
            }
          : {
              currentMetalRate: {
                $cond: {
                  if: { $eq: ["$isMrp", false] },
                  then: "$currentRate",
                  else: "$currentMetalRate",
                },
              },
            }),
      },
    },

    {
      $lookup: {
        from: "stonedetails",
        localField: `${p}stoneDetails`,
        foreignField: "_id",
        as: "lookupStones",
      },
    },
    {
      $addFields: {
        stonesToSum: {
          $cond: {
            if: { $gt: [{ $size: "$lookupStones" }, 0] },
            then: "$lookupStones",
            else: {
              $cond: {
                if: { $isArray: [`$${p}stoneDetails`] },
                then: `$${p}stoneDetails`,
                else: [],
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        totalStoneValue: {
          $sum: {
            $map: {
              input: "$stonesToSum",
              as: "s",
              in: { $ifNull: ["$$s.price", 0] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        metalValue: {
          $cond: {
            if: { $eq: ["$isMrp", true] },
            then: "$currentRate",
            else: {
              $multiply: [{ $ifNull: [`${$p}netWeight`, 0] }, "$currentRate"],
            },
          },
        },

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

        makingAmount: {
          $ifNull: [`${$p}makingCharges.makingDiscountedValue`, 0],
        },
        wastageAmount: {
          $ifNull: [`${$p}wastageCharges.wastageDiscountedValue`, 0],
        },

        actualMakingAmount: {
          $ifNull: [`${$p}makingCharges.makingActualValue`, 0],
        },
        actualWastageAmount: {
          $ifNull: [`${$p}wastageCharges.wastageActualValue`, 0],
        },
      },
    },
    {
      $addFields: {
        makingValue: {
          $cond: {
            if: { $eq: [`${$p}makingCharges.makingMode`, 1] },
            then: "$makingAmount",
            else: { $multiply: ["$makingWeightBase", "$makingAmount"] },
          },
        },
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

        actualMakingValue: {
          $cond: {
            if: { $eq: [`${$p}makingCharges.makingMode`, 1] },
            then: "$actualMakingAmount",
            else: { $multiply: ["$makingWeightBase", "$actualMakingAmount"] },
          },
        },
        actualWastageValue: {
          $cond: {
            if: { $eq: [`${$p}wastageCharges.wastageMode`, 1] },
            then: "$actualWastageAmount",
            else: {
              $multiply: [
                { $divide: ["$actualWastageAmount", 100] },
                "$currentRate",
                "$wastageWeightBase",
              ],
            },
          },
        },
      },
    },
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
        actualSubTotal: {
          $add: [
            "$metalValue",
            "$actualMakingValue",
            "$actualWastageValue",
            "$totalStoneValue",
            { $ifNull: [`${$p}huidCharges`, 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        gstAmount: {
          $divide: [
            { $multiply: ["$subTotal", { $ifNull: [`${$p}gst`, 3] }] },
            100,
          ],
        },
        actualGstAmount: {
          $divide: [
            { $multiply: ["$actualSubTotal", { $ifNull: [`${$p}gst`, 3] }] },
            100,
          ],
        },
      },
    },
    {
      $addFields: {
        calculatedPrice: { $round: [{ $add: ["$subTotal", "$gstAmount"] }, 2] }, // outprice
        calculatedTotalPrice: {
          $round: [{ $add: ["$actualSubTotal", "$actualGstAmount"] }, 2],
        }, // totalPrice
      },
    },
    {
      $addFields: {
        rateInfo: { $arrayElemAt: ["$rateInfo", 0] },
        metalrate: "$currentRate",
      },
    },
    {
      $project: {
        lookupStones: 0,
        stonesToSum: 0,
        stones: 0,
        makingWeightBase: 0,
        wastageWeightBase: 0,
        makingAmount: 0,
        wastageAmount: 0,
        actualMakingAmount: 0,
        actualWastageAmount: 0,
        actualMakingValue: 0,
        actualWastageValue: 0,
        subTotal: 0,
        actualSubTotal: 0,
        gstAmount: 0,
        actualGstAmount: 0,
      },
    },
  ];
};
