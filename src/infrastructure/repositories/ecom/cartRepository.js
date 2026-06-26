import cartModel from "../../models/ecom/cartModel.js";
import cartItemModel from "../../models/ecom/cartItemModel.js";
import mongoose from "mongoose";
import config from "../../../config/chit/env.js";
import CartItem from "../../models/ecom/cartItemModel.js";
const ObjectId = mongoose.Types.ObjectId;
class CartRepository {
  async create(cartData) {
    try {
      const cart = new cartModel(cartData);
      return await cart.save();
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (createCart): ${error.message}`);
    }
  }

  async findCartByUserId(userId) {
    try {
      return await cartModel.findOne({ userId });
    } catch (error) {
      throw new Error(`Repository Error (findCartByuserId): ${error.message}`);
    }
  }

  async findById(cartId) {
    try {
      const s3Setting = await mongoose.connection
        .collection("s3bucketsettings")
        .findOne({});
      const s3display_url = s3Setting ? s3Setting.s3display_url : "";
      const pathurl = `${s3display_url}${config.AWS_LOCAL_PATH || "uploads/"}products/`;

      const cartData = await cartModel.findById(cartId);

      const item = await cartItemModel.aggregate([
        {
          $match: {
            cartId: new mongoose.Types.ObjectId(cartId),
            is_deleted: false,
          },
        },

        // Lookup item details
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            as: "Item",
          },
        },
        { $unwind: { path: "$Item", preserveNullAndEmptyArrays: true } },

        // Lookup product details
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "Product",
          },
        },
        { $unwind: { path: "$Product", preserveNullAndEmptyArrays: true } },

        {
          $addFields: {
            "Product.grossWt": {
              $ifNull: ["$Item.grossWt", "$metalWeight", 0],
            },
            "Product.netWeight": {
              $ifNull: ["$Item.netWeight", "$metalWeight", 0],
            },
            "Product.id_purity": { $ifNull: ["$Item.id_purity", "$id_purity"] },
            "Product.id_metal": {
              $ifNull: [
                "$Product.id_metal",
                "$id_metal",
                "$Item.id_purity.id_metal",
              ],
            },
            "Product.id_branch": { $ifNull: ["$Product.id_branch", null] },
            "Product.gst": { $ifNull: ["$Product.gst", "$Item.gst", 0] },
            "Product.huidCharges": { $ifNull: ["$Item.huidCharges", 0] },
            "Product.stoneDetails": { $ifNull: ["$Item.stoneDetails", []] },
            "Product.sku": { $ifNull: ["$Item.tagNo", "$sku", ""] },
            "Product.makingCharges": {
              mode: { $ifNull: ["$Item.makingCharges.makingMode", 1] },
              calculationType: "$Item.makingCharges.calculationType",
              actualValue: {
                $ifNull: ["$Item.makingCharges.makingActualValue", 0],
              },
              discountedPercentage: {
                $ifNull: ["$Item.makingCharges.makingDiscountedPercentage", 0],
              },
              discountedValue: {
                $ifNull: ["$Item.makingCharges.makingDiscountedValue", 0],
              },
            },
            "Product.wastageCharges": {
              mode: { $ifNull: ["$Item.wastageCharges.wastageMode", 1] },
              calculationType: "$Item.wastageCharges.calculationType",
              actualValue: {
                $ifNull: ["$Item.wastageCharges.wastageActualValue", 0],
              },
              discountedPercentage: {
                $ifNull: [
                  "$Item.wastageCharges.wastageDiscountedPercentage",
                  0,
                ],
              },
              discountedValue: {
                $ifNull: ["$Item.wastageCharges.wastageDiscountedValue", 0],
              },
            },
            productSize: {
              sizeValue: { $ifNull: ["$Item.sizeValue", ""] },
              quantity: { $ifNull: ["$quantity", 1] },
            },
            SizeMaster: {
              unit: { $ifNull: ["$Item.unit", ""] },
            },
          },
        },

        // Lookup purity name
        {
          $lookup: {
            from: "purities",
            let: { pId: "$Item.id_purity" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      "$_id",
                      {
                        $convert: {
                          input: "$$pId",
                          to: "objectId",
                          onError: "$$pId",
                          onNull: "$$pId",
                        },
                      },
                    ],
                  },
                },
              },
            ],
            as: "purityDetails",
          },
        },
        {
          $unwind: { path: "$purityDetails", preserveNullAndEmptyArrays: true },
        },

        // Lookup latest metal rate
        {
          $lookup: {
            from: "metalrates",
            let: {
              metalId: {
                $ifNull: ["$Product.id_metal", "$Item.id_purity.id_metal"],
              },
              purityId: {
                $ifNull: ["$Product.id_purity._id", "$Product.id_purity"],
              },
              id_branch: "$Product.id_branch",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$material_type_id",
                          {
                            $convert: {
                              input: "$$metalId",
                              to: "objectId",
                              onError: "$$metalId",
                              onNull: "$$metalId",
                            },
                          },
                        ],
                      },
                      {
                        $eq: [
                          "$purity_id",
                          {
                            $convert: {
                              input: "$$purityId",
                              to: "objectId",
                              onError: "$$purityId",
                              onNull: "$$purityId",
                            },
                          },
                        ],
                      },
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
            localField: "Product.stoneDetails",
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
        // Metal price selection
        {
          $addFields: {
            latestMetalPrice: {
              $cond: {
                if: { $eq: ["$Product.isMrp", true] },
                then: { $ifNull: ["$Item.currentMetalRate", 0] },
                else: {
                  $ifNull: [
                    { $arrayElemAt: ["$metalPriceInfo.rate", 0] },
                    { $ifNull: ["$Item.currentMetalRate", 250] },
                  ],
                },
              },
            },
          },
        },

        // 1. Calculate Metal Value
        {
          $addFields: {
            baseMetalValue: {
              $cond: {
                if: { $eq: ["$Product.isMrp", true] },
                then: "$latestMetalPrice",
                else: {
                  $multiply: [
                    { $ifNull: ["$Product.netWeight", 0] },
                    { $ifNull: ["$latestMetalPrice", 0] },
                  ],
                },
              },
            },
          },
        },

        // 2. Weight Bases for Charges
        {
          $addFields: {
            makingWeightBase: {
              $cond: {
                if: { $eq: ["$Product.makingCharges.calculationType", 1] },
                then: { $ifNull: ["$Product.grossWt", 0] },
                else: { $ifNull: ["$Product.netWeight", 0] },
              },
            },
            wastageWeightBase: {
              $cond: {
                if: { $eq: ["$Product.wastageCharges.calculationType", 1] },
                then: { $ifNull: ["$Product.grossWt", 0] },
                else: { $ifNull: ["$Product.netWeight", 0] },
              },
            },
          },
        },

        // 3. Discounted and Actual Charges
        {
          $addFields: {
            finalMakingCharge: {
              $cond: {
                if: { $eq: ["$Product.makingCharges.mode", 1] },
                then: {
                  $ifNull: ["$Product.makingCharges.discountedValue", 0],
                },
                else: {
                  $multiply: [
                    "$makingWeightBase",
                    { $ifNull: ["$Product.makingCharges.discountedValue", 0] },
                  ],
                },
              },
            },
            finalWastageCharge: {
              $cond: {
                if: { $eq: ["$Product.wastageCharges.mode", 1] },
                then: {
                  $ifNull: ["$Product.wastageCharges.discountedValue", 0],
                },
                else: {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $ifNull: [
                            "$Product.wastageCharges.discountedValue",
                            0,
                          ],
                        },
                        100,
                      ],
                    },
                    "$latestMetalPrice",
                    "$wastageWeightBase",
                  ],
                },
              },
            },

            // --- Actual Charges ---
            rawMakingCharge: {
              $cond: {
                if: { $eq: ["$Product.makingCharges.mode", 1] },
                then: { $ifNull: ["$Product.makingCharges.actualValue", 0] },
                else: {
                  $multiply: [
                    "$makingWeightBase",
                    { $ifNull: ["$Product.makingCharges.actualValue", 0] },
                  ],
                },
              },
            },
            rawWastageCharge: {
              $cond: {
                if: { $eq: ["$Product.wastageCharges.mode", 1] },
                then: { $ifNull: ["$Product.wastageCharges.actualValue", 0] },
                else: {
                  $multiply: [
                    {
                      $divide: [
                        { $ifNull: ["$Product.wastageCharges.actualValue", 0] },
                        100,
                      ],
                    },
                    "$latestMetalPrice",
                    "$wastageWeightBase",
                  ],
                },
              },
            },
          },
        },

        // 4. Diamond & Stone values
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

        // 5. Subtotals
        {
          $addFields: {
            discountedSubtotal: {
              $add: [
                { $ifNull: ["$baseMetalValue", 0] },
                { $ifNull: ["$finalWastageCharge", 0] },
                { $ifNull: ["$finalMakingCharge", 0] },
                { $ifNull: ["$diamondValue", 0] },
                { $ifNull: ["$stoneValue", 0] },
                { $ifNull: ["$Product.huidCharges", 0] },
              ],
            },
            actualSubtotal: {
              $add: [
                { $ifNull: ["$baseMetalValue", 0] },
                { $ifNull: ["$rawWastageCharge", 0] },
                { $ifNull: ["$rawMakingCharge", 0] },
                { $ifNull: ["$diamondValue", 0] },
                { $ifNull: ["$stoneValue", 0] },
                { $ifNull: ["$Product.huidCharges", 0] },
              ],
            },
          },
        },

        // 6. GST Calculation
        {
          $addFields: {
            gstRate: {
              $divide: [
                {
                  $multiply: [
                    "$discountedSubtotal",
                    { $ifNull: ["$Product.gst", 3] },
                  ],
                },
                100,
              ],
            },
            actualGstRate: {
              $divide: [
                {
                  $multiply: [
                    "$actualSubtotal",
                    { $ifNull: ["$Product.gst", 3] },
                  ],
                },
                100,
              ],
            },
          },
        },

        // 7. Final Projection
        {
          $project: {
            _id: 0,
            productId: "$Product._id",
            itemId: "$itemId",
            productName: "$Product.product_name",
            onlineProduct: "$Product.onlineProduct",
            qty: { $ifNull: ["$quantity", 1] },
            grossWt: "$Product.grossWt",
            netWt: "$Product.netWeight",
            shippingCharge: { $literal: 0 },

            price: {
              $round: [
                {
                  $multiply: [
                    { $add: ["$discountedSubtotal", "$gstRate"] },
                    { $ifNull: ["$quantity", 1] },
                  ],
                },
                0,
              ],
            },
            totalprice: {
              $round: [
                {
                  $multiply: [
                    { $add: ["$actualSubtotal", "$actualGstRate"] },
                    { $ifNull: ["$quantity", 1] },
                  ],
                },
                0,
              ],
            },

            metalValue: { $round: ["$baseMetalValue", 2] },
            makingValue: { $round: ["$finalMakingCharge", 2] },
            wastageValue: { $round: ["$finalWastageCharge", 2] },
            stoneValue: {
              $round: [{ $add: ["$diamondValue", "$stoneValue"] }, 2],
            },
            gstValue: { $round: ["$gstRate", 2] },
            gstamount: {
              $round: [
                { $multiply: ["$gstRate", { $ifNull: ["$quantity", 1] }] },
                2,
              ],
            },

            // Breakup
            priceBreakup: {
              metalValue: { $round: ["$baseMetalValue", 2] },
              makingValue: { $round: ["$finalMakingCharge", 2] },
              wastageValue: { $round: ["$finalWastageCharge", 2] },
              stoneValue: {
                $round: [{ $add: ["$diamondValue", "$stoneValue"] }, 2],
              },
              gstValue: { $round: ["$gstRate", 2] },
              huidCharges: { $ifNull: ["$Item.huidCharges", 0] },
            },

            // Other metadata
            latestMetalPrice: { $ifNull: ["$latestMetalPrice", 0] },
            metalRate: { $ifNull: ["$latestMetalPrice", 0] },
            id_metal: "$Product.id_metal",
            id_purity: "$Product.id_purity",
            purityName: "$purityDetails.purity_name",
            makingCharges: "$Product.makingCharges",
            wastageCharges: "$Product.wastageCharges",
            finalMakingCharge: { $round: ["$finalMakingCharge", 2] },
            finalWastageCharge: { $round: ["$finalWastageCharge", 2] },

            sizeId: "$sizeId",
            categoryId: "$Product.id_category",
            subCategoryId: "$Product.subcategoryId",
            collectionId: "$Product.collection",

            productSize: {
              $concat: [
                { $ifNull: [{ $toString: "$productSize.sizeValue" }, ""] },
                { $ifNull: ["$SizeMaster.unit", ""] },
              ],
            },
            sizeValue: "$productSize.sizeValue",
            unit: "$SizeMaster.unit",

            totalDiamondWeight: "$totalDiamondWeight",
            totalStoneWeight: "$totalStoneWeight",
            sizeQuantity: { $ifNull: ["$productSize.quantity", 0] },
            sku: "$Product.sku",
            tagNo: "$Item.tagNo",
            huidNo: "$Item.huidNo",
            huidCharges: { $ifNull: ["$Item.huidCharges", 0] },
            diaCertificateNo: "$Item.diaCertificateNo",

            // Image fields
            pathurl: { $literal: pathurl },
            productImg: {
              $ifNull: [{ $arrayElemAt: ["$Product.product_image", 0] }, ""],
            },
            image: {
              $ifNull: [{ $arrayElemAt: ["$Product.product_image", 0] }, ""],
            },
            product_image: "$Product.product_image",

            id_category: "$Product.id_category",
            id_branch: "$Product.id_branch",
            gst: "$Product.gst",
            discountAmount: {
              $round: [
                {
                  $multiply: [
                    {
                      $subtract: [
                        { $add: ["$actualSubtotal", "$actualGstRate"] },
                        { $add: ["$discountedSubtotal", "$gstRate"] },
                      ],
                    },
                    { $ifNull: ["$quantity", 1] },
                  ],
                },
                2,
              ],
            },
            gstRate: "$gstRate",
            discountedPriceWithoutGst: {
              $round: [
                {
                  $multiply: [
                    "$discountedSubtotal",
                    { $ifNull: ["$quantity", 1] },
                  ],
                },
                2,
              ],
            },
            soldOut: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$Item.active", false] },
                    { $eq: ["$Item.status", 2] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },

        {
          $facet: {
            items: [{ $match: {} }],
            overAllAmount: [
              {
                $group: {
                  _id: null,
                  totalAmount: { $sum: "$totalprice" },
                  subTotal: { $sum: "$price" },
                  totalPrice: { $sum: "$price" },
                  totalDiscount: { $sum: "$discountAmount" },
                  shippingCharge: { $sum: "$shippingCharge" },
                  totalGstAmount: { $sum: "$gstamount" },
                  gstRate: { $sum: "$gstamount" },
                  withoutGstPrice: { $sum: "$discountedPriceWithoutGst" }
                },
              },
              { $project: { _id: 0 } },
            ],
          },
        },

        {
          $project: {
            items: 1,
            overAllAmount: { $arrayElemAt: ["$overAllAmount", 0] },
          },
        },
      ]);
      const result = item[0] ?? { items: [], overAllAmount: {} };

      return {
        ...result,
        cartId: cartData._id,
        pathurl: pathurl,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (findCartById): ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      return await cartModel.findOne({ userId, status: "active" });
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (findByUserId): ${error.message}`);
    }
  }

  async addItemToCart(itemData) {
    try {
      const newItem = new cartItemModel(itemData);
      return await newItem.save();
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (addItemToCart): ${error.message}`);
    }
  }

  async updateCartTotals(cartId) {
    try {
      const cartData = await this.findById(cartId);
      const overAll = cartData?.overAllAmount ?? {};

      const subtotal = overAll.subTotal ?? 0;
      const grandTotal = overAll.totalAmount ?? subtotal;
      const taxTotal = overAll.totalGstAmount ?? 0;
      const itemDiscountTotal = overAll.totalDiscount ?? 0;

      await cartModel.findByIdAndUpdate(cartId, {
        $set: { subtotal, grandTotal, taxTotal, itemDiscountTotal },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (updateCartTotals): ${error.message}`);
    }
  }

  async findCartItemByItemId(cartId, itemId) {
    try {
      return await cartItemModel
        .findOne({ cartId, itemId, is_deleted: { $ne: true } })
        .lean();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Repository Error (findCartItemByItemId): ${error.message}`,
      );
    }
  }

  async removeItem(itemId, cartId) {
    try {
      return await cartItemModel.findOneAndUpdate(
        {
          itemId: new ObjectId(itemId),
          cartId: new ObjectId(cartId),
          is_deleted: false
        },
        { $set: { is_deleted: true } },
        { new: true }
      );

    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (removeItem): ${error.message}`);
    }
  }

  async getCartSummary(cartId) {
    try {
      const items = await cartItemModel.find({ cartId, is_deleted: false }).populate("productId");
      if (!items.length) return { totalItems: 0, totalPrice: 0 };

      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce(
        (sum, item) => sum + item.quantity * (item.productId?.unitPrice || 0),
        0,
      );

      return { totalItems, totalPrice };
    } catch (error) {
      console.error(error);
      throw new Error(`Repository Error (getCartSummary): ${error.message}`);
    }
  }

  async findProductByBranch(cartId, branchId) {
    try {
      const findProduct = await CartItem.aggregate([
        {
          $match: {
            cartId: new ObjectId(cartId),
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "Product",
          },
        },
        {
          $unwind: {
            path: "$Product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "Product.id_branch": { $ne: new ObjectId(branchId) }, // ✅ works now
          },
        },
        {
          $project: {
            _id: 0,
            productId: "$Product._id",
          },
        },
      ]);

      return findProduct;
    } catch (error) {
      console.error("Error in findProductByBranch:", error);
      return null;
    }
  }

  async findCartItemCount(cartId) {
    try {
      return await CartItem.find({
        cartId,
        is_deleted: false,
      }).countDocuments();
    } catch (error) {
      console.error("Error in findCartItemCount:", error);
      return null;
    }
  }
}

export default CartRepository;
