import mongoose from "mongoose";
import config from "../../../config/chit/env.js";
import CartItem from "../../models/ecom/cartItemModel.js";
import { OrderItem } from "../../models/ecom/orderItemModel.js";
import { Order } from "../../models/ecom/orderModel.js";
import productModel from "../../models/chit/productModel.js";
import orderStatusModel from "../../models/ecom/orderStatusModel.js";
import metalRateModel from "../../models/chit/metalRateModel.js";
import itemModel from "../../models/ecom/itemModel.js";
import organisation from "../../models/chit/organisationModel.js";
import {
  ORDER_STATUS,
  ORDER_STATUS_NO,
  ORDER_TYPE,
  ORDER_TYPE_NAME,
} from "../../../config/chit/const.js";

const encodeCursor = (payload) => Buffer.from(JSON.stringify(payload)).toString("base64");
const decodeCursor = (cursor) => {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  } catch (error) {
    return null;
  }
};

class OrderRepository {
  async createOrder(orderData, orderItems) {
    try {
      const createdOrder = await Order.create(orderData);
      if (!createdOrder) {
        return null;
      }

      const itemsWithOrderId = orderItems.map((item) => ({
        ...item,
        orderId: createdOrder._id,
      }));

      const createdOrderItems = await OrderItem.insertMany(itemsWithOrderId);
      if (!createdOrderItems) {
        return null;
      }

      return { order: createdOrder, items: createdOrderItems };
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw error;
    }
  }

  async findOrderItemsByCartId(cartId) {
    try {
      return OrderItem.find({ orderId: cartId });
    } catch (error) {
      throw new Error(`Repository Error (findCartByuserId): ${error.message}`);
    }
  }

  async orderInfo(paymentId) {
    try {
      console.log(paymentId)
      return Order.findOne({ paymentId: paymentId }).select("_id");
    } catch (error) {
      throw new Error(`Repository Error (findCartByuserId): ${error.message}`);
    }
  }

  async findOrders(userId, limit = null, cursor = null) {
    try {
      const match = { userId };
      
      if (cursor) {
        const decoded = decodeCursor(cursor);
        if (decoded) {
          match.$or = [
            { createdAt: { $lt: new Date(decoded.createdAt) } },
            { createdAt: { $eq: new Date(decoded.createdAt) }, _id: { $lt: new mongoose.Types.ObjectId(decoded._id) } }
          ];
        }
      }

      let query = Order.find(match)
        .populate({
          path: "deliveryAddress",
          populate: [
            { path: "id_city" },
            { path: "id_state" },
            { path: "id_country" },
          ],
        })
        .populate({
          path: "items.productId",
          populate: [
            {
              path: "stoneDetails",
              model: "StoneDetail",
            },
            {
              path: "id_metal",
              model: "Metal",
            },
            {
              path: "id_purity",
              model: "Purity",
            },
            {
              path: "id_branch",
              model: "Branch",
            },
          ],
          strictPopulate: false,
        })
        .populate({
          path: "paymentDetails",
          model: "Payment",
          strictPopulate: false,
        })
        .sort({ createdAt: -1, _id: -1 })
        .lean();

      if (limit) {
        query = query.limit(parseInt(limit) + 1);
      }

      let findOrder = await query;
      let hasNextPage = false;
      let nextCursor = null;

      if (limit && findOrder.length > limit) {
        hasNextPage = true;
        findOrder = findOrder.slice(0, limit);
      }

      if (hasNextPage && findOrder.length > 0) {
        const lastItem = findOrder[findOrder.length - 1];
        nextCursor = encodeCursor({ _id: lastItem._id, createdAt: lastItem.createdAt });
      }

      const ordersWithDetails = await Promise.all(
        findOrder.map(async (order) => {
          if (order.deliveryAddress) {
            const addr = order.deliveryAddress;
            const fullAddress = [
              addr.address,
              addr.landmark,
              addr.id_city?.city_name,
              addr.id_state?.state_name,
              addr.id_country?.country_name,
              addr.pincode,
            ]
              .filter(Boolean)
              .join(", ");
            order.address = fullAddress;
          }

          if (order.items && order.items.length > 0) {
            order.items = await Promise.all(
              order.items.map(async (item) => {
                const product = item.productId;
                if (!product) return item;
                const metalRate = await metalRateModel
                  .findOne({
                    material_type_id: product.id_metal?._id,
                    purity_id: product.id_purity?._id,
                  })
                  .sort({ createdAt: -1 })
                  .lean();

                const currentMetalRate = metalRate?.rate || 0;
                const gstInfo = await GstSetting.findOne({
                  id_branch: product.id_branch?._id,
                }).lean();

                const gstRate = gstInfo?.rate || 0;

                const grossWeight = product.grossWt || 0;
                const netWeight = product.netWeight || product.grossWt || 0;

                // Calculate base metal value
                const baseMetalValue = netWeight * currentMetalRate;
                let rawMakingCharge = 0;
                let finalMakingCharge = 0;

                if (product.makingCharges) {
                  if (product.makingCharges.mode === 1) {
                    rawMakingCharge = product.makingCharges.actualValue || 0;
                  } else if (product.makingCharges.mode === 2) {
                    rawMakingCharge =
                      grossWeight * (product.makingCharges.actualValue || 0);
                  }

                  finalMakingCharge =
                    Math.round(
                      (rawMakingCharge -
                        (product.makingCharges.discountedValue || 0)) *
                      100,
                    ) / 100;
                }

                // Calculate wastage charges
                let rawWastageCharge = 0;
                let finalWastageCharge = 0;

                if (product.wastageCharges) {
                  if (product.wastageCharges.mode === 1) {
                    rawWastageCharge = product.wastageCharges.actualValue || 0;
                  } else if (
                    product.wastageCharges.mode === 2 ||
                    product.wastageCharges.mode === 3
                  ) {
                    rawWastageCharge =
                      baseMetalValue *
                      ((product.wastageCharges.actualValue || 0) / 100);
                  }

                  finalWastageCharge =
                    Math.round(
                      (rawWastageCharge -
                        (product.wastageCharges.discountedValue || 0)) *
                      100,
                    ) / 100;
                }

                // Calculate stone details
                const stoneDetails = (product.stoneDetails || []).map(
                  (stone) => ({
                    type: stone.type,
                    cts: stone.cts || 0,
                    amount: stone.amount || 0,
                    price: stone.price || 0,
                    stoneName: stone.stoneName || "",
                  }),
                );

                const diamondValue = stoneDetails
                  .filter((stone) => stone.type === "diamond")
                  .reduce((sum, diamond) => sum + (diamond.price || 0), 0);

                const stoneValue = stoneDetails
                  .filter((stone) => stone.type === "stone")
                  .reduce((sum, stone) => sum + (stone.price || 0), 0);

                // Calculate subtotals
                const discountedSubtotal =
                  baseMetalValue +
                  finalWastageCharge +
                  finalMakingCharge +
                  diamondValue +
                  stoneValue +
                  (product.huidCharges || 0);
                const actualSubtotal =
                  baseMetalValue +
                  rawWastageCharge +
                  rawMakingCharge +
                  diamondValue +
                  stoneValue +
                  (product.huidCharges || 0);

                // Calculate GST amounts
                const discountedAmount =
                  Math.round(discountedSubtotal * (1 + gstRate / 100) * 100) /
                  100;

                const totalAmount =
                  Math.round(actualSubtotal * (1 + gstRate / 100) * 100) / 100;

                const gstAmount =
                  Math.round(discountedSubtotal * (gstRate / 100) * 100) / 100;

                // Add all calculated fields to the item
                return {
                  ...item,
                  sku: product.sku || product.product_code || "",
                  name: product.product_name || "",
                  purityName: product.id_purity?.purity_name || "",
                  hsn: product.hsn_code || "",
                  metalRate: currentMetalRate,
                  grossWeight: grossWeight,
                  netWeight: netWeight,

                  // Primary pricing fields
                  price: Math.round(discountedSubtotal),
                  totalprice: Math.round(discountedAmount),
                  subtotal: Math.round(discountedSubtotal),
                  totalWithGst: Math.round(discountedAmount),

                  // Detailed values
                  metalValue: Math.round(baseMetalValue * 100) / 100,
                  makingValue: Math.round(finalMakingCharge * 100) / 100,
                  wastageValue: Math.round(finalWastageCharge * 100) / 100,
                  stoneValue:
                    Math.round((stoneValue + diamondValue) * 100) / 100,
                  gstValue: Math.round(gstAmount * 10000) / 10000,
                  gstamount: Math.round(gstAmount * 10000) / 10000,

                  priceBreakup: {
                    metalValue: Math.round(baseMetalValue * 100) / 100,
                    makingValue: Math.round(finalMakingCharge * 100) / 100,
                    wastageValue: Math.round(finalWastageCharge * 100) / 100,
                    stoneValue:
                      Math.round((stoneValue + diamondValue) * 100) / 100,
                    gstValue: Math.round(gstAmount * 10000) / 10000,
                    huidCharges: product.huidCharges || 0,
                  },

                  wastage: product.wastageCharges
                    ? {
                      mode: product.wastageCharges.mode,
                      percentage:
                        product.wastageCharges.mode === 2 ||
                          product.wastageCharges.mode === 3
                          ? product.wastageCharges.actualValue
                          : null,
                      amount:
                        product.wastageCharges.mode === 1
                          ? product.wastageCharges.actualValue
                          : null,
                      discountedValue:
                        product.wastageCharges.discountedValue || 0,
                      finalCharge: finalWastageCharge,
                    }
                    : null,
                  makingCharge: {
                    raw: rawMakingCharge,
                    final: finalMakingCharge,
                    mode: product.makingCharges?.mode,
                    discountedValue:
                      product.makingCharges?.discountedValue || 0,
                  },
                  gst: {
                    rate: gstRate,
                    amount: gstAmount,
                  },
                  stoneDetails: stoneDetails,
                  totalStoneValue: stoneValue + diamondValue,
                  calculations: {
                    baseMetalValue: baseMetalValue,
                    discountedSubtotal: discountedSubtotal,
                    actualSubtotal: actualSubtotal,
                    discountedAmount: discountedAmount,
                    totalAmount: totalAmount,
                  },
                };
              }),
            );

            order.totalGST = order.items.reduce(
              (sum, item) => sum + (item.gst?.amount || 0),
              0,
            );

            order.paymentMode = order.paymentDetails?.paymentMode || "Unknown";
          }
          order.orderType = ORDER_TYPE_NAME[order.orderType];
          return order;
        }),
      );

      return { orders: ordersWithDetails, nextCursor, hasNextPage };
    } catch (error) {
      console.error("Error in findOrders:", error);
      return null;
    }
  }

  async findOrderItems(orderId) {
    try {
      const findOrder = await Order.findById(orderId)

        .populate({
          path: "deliveryAddress",
          populate: [
            { path: "id_city" },
            { path: "id_state" },
            { path: "id_country" },
          ],
        })
        .populate("paymentId")
        .lean();
      let address = "";
      if (findOrder.deliveryAddress) {
        const addr = findOrder.deliveryAddress;
        address = [
          addr.address,
          addr.landmark,
          addr.id_city?.city_name,
          addr.id_state?.state_name,
          addr.id_country?.country_name,
          addr.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      }
      console.log(findOrder)
      const findOrderItem = await OrderItem.aggregate([
        {
          $match: {
            orderId: new mongoose.Types.ObjectId(orderId),
          },
        },

        // Lookup item details for size/huid/etc
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            as: "ItemInfo",
          },
        },
        {
          $unwind: {
            path: "$ItemInfo",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup purity
        {
          $lookup: {
            from: "purities",
            localField: "id_purity",
            foreignField: "_id",
            as: "Purity",
          },
        },
        {
          $unwind: {
            path: "$Purity",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup product
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productId",
          },
        },
        {
          $unwind: {
            path: "$productId",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup sizeMaster for fallback
        {
          $lookup: {
            from: "sizemasters",
            localField: "productId.sizeId",
            foreignField: "_id",
            as: "SizeMaster",
          },
        },
        {
          $unwind: {
            path: "$SizeMaster",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Find matching size object from product for fallback
        {
          $addFields: {
            productSize: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$productId.availableSizes.values",
                    as: "size",
                    cond: { $eq: ["$$size._id", "$sizeId"] },
                  },
                },
                0,
              ],
            },
          },
        },

        // Create final size text
        {
          $addFields: {
            size: {
              $ifNull: [
                "$size",
                {
                  $ifNull: [
                    {
                      $concat: [
                        { $ifNull: ["$ItemInfo.sizeValue", ""] },
                        { $ifNull: ["$ItemInfo.unit", ""] },
                      ],
                    },
                    {
                      $concat: [
                        {
                          $toString: {
                            $ifNull: ["$productSize.sizeValue", ""],
                          },
                        },
                        { $ifNull: ["$SizeMaster.unit", ""] },
                      ],
                    },
                  ],
                },
              ],
            },
            sizeValue: "$ItemInfo.sizeValue",
            purityName: { $ifNull: ["$purityName", "$Purity.purity_name"] },
            totalStoneWeight: { $cond: [{ $gt: ["$totalStoneWeight", 0] }, "$totalStoneWeight", "$ItemInfo.stonewt"] },
            totalDiamondWeight: { $cond: [{ $gt: ["$totalDiamondWeight", 0] }, "$totalDiamondWeight", "$ItemInfo.diamondwt"] },
          },
        },


        // Final Project
        {
          $project: {
            SizeMaster: 0,
            productSize: 0,
            Purity: 0,
            ItemInfo: 0,
            "productId.availableSizes": 0,
          },
        },
        {
          $addFields: {
            price: "$price",
            totalprice: "$totalPrice",
            subtotal: "$price",
            // totalWithGst: "$discountAmount",
            discountAmount: { $round: [{ $subtract: ["$totalPrice", "$price"] }, 0] },
            gstamount: { $ifNull: ["$gstAmount", 0] },

            priceBreakup: {
              metalValue: { $round: ["$calculations.baseMetalValue", 2] }, // If saved in calculations
              makingValue: { $round: ["$makingCharges.discountedValue", 2] },
              wastageValue: { $round: ["$wastageCharges.discountedValue", 2] },
              stoneValue: {
                $round: [
                  { $add: ["$totalStonePrice", "$totalDiamondPrice"] },
                  2,
                ],
              },
              gstValue: { $round: ["$gstAmount", 4] },
              huidCharges: { $ifNull: ["$huidCharges", 0] },
            },
          },
        },
      ]);

      for (let i = 0; i < findOrderItem.length; i++) {
        const item = findOrderItem[i];
        if (
          !(Number(item.totalStoneWeight) || 0) &&
          !(Number(item.totalDiamondWeight) || 0) &&
          !(Number(item.totalStonePrice) || 0) &&
          !(Number(item.totalDiamondPrice) || 0) &&
          item.itemId
        ) {
          const itemDoc = await itemModel.findById(item.itemId).populate({
            path: "stoneDetails",
            populate: { path: "itemId" }
          }).lean();

          if (itemDoc && itemDoc.stoneDetails && itemDoc.stoneDetails.length > 0) {
            let tsw = 0, tdw = 0, tsp = 0, tdp = 0;
            itemDoc.stoneDetails.forEach((stone) => {
              let price = Number(stone.price || 0);
              if (price === 0 && stone.itemId && stone.itemId.percraterate) {
                price = Number(stone.weight || 0) * Number(stone.itemId.percraterate || 0) + Number(stone.itemId.charge || 0);
              }
              if (stone.type && stone.type.toLowerCase() === "diamond") {
                tdw += Number(stone.weight || 0);
                tdp += price;
              } else if (stone.type && stone.type.toLowerCase() === "stone") {
                tsw += Number(stone.weight || 0);
                tsp += price;
              }
            });

            item.totalStoneWeight = tsw;
            item.totalDiamondWeight = tdw;
            item.totalStonePrice = tsp;
            item.totalDiamondPrice = tdp;

            if (item.priceBreakup) {
              item.priceBreakup.stoneValue = Math.round((tsp + tdp) * 100) / 100;
            }
          }
        }
      }
      const computedTotalStoneWeight = findOrderItem.reduce((acc, item) => acc + (Number(item.totalStoneWeight) || 0), 0);
      const computedTotalDiamondWeight = findOrderItem.reduce((acc, item) => acc + (Number(item.totalDiamondWeight) || 0), 0);
      const computedTotalStonePrice = findOrderItem.reduce((acc, item) => acc + (Number(item.totalStonePrice) || 0), 0);
      const computedTotalDiamondPrice = findOrderItem.reduce((acc, item) => acc + (Number(item.totalDiamondPrice) || 0), 0);
      const computedTotalGstAmount = findOrderItem.reduce((acc, item) => acc + (Number(item.gstamount) || 0), 0);

      return {
        item: findOrderItem,
        overAll: {
          placedAt: findOrder.createdAt,
          estimatedDeliveryDate: findOrder.estimatedDeliveryDate,
          arrivedAt:
            findOrder?.statusData[findOrder.statusData.length - 1]?.date,
          orderId: findOrder.orderId,
          address,
          subTotal: findOrder.subtotal,
          totalAmount: findOrder.totalAmount,
          shippingCharge: findOrder.shippingFee,
          status: findOrder.status,
          statusType: findOrder.orderStatus,
          savedAmount: findOrder.savedAmount,
          trackingNo: findOrder?.trackerId,
          parcelService: findOrder?.parcelService,
          orderTypeNo: findOrder?.orderType,
          paymentMode: findOrder?.paymentId?.paymentModeName,
          cancelReason: findOrder?.cancelReason,
          totalGstAmount: findOrder?.totalGstAmount || computedTotalGstAmount,
          totalStoneWeight: findOrder?.totalStoneWeight || computedTotalStoneWeight,
          totalDiamondWeight: findOrder?.totalDiamondWeight || computedTotalDiamondWeight,
          totalStonePrice: findOrder?.totalStonePrice || computedTotalStonePrice,
          totalDiamondPrice: findOrder?.totalDiamondPrice || computedTotalDiamondPrice,
        },
        pathUrl: `${config.DISPLAY_IMG_URL}products/`,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findById(orderId) {
    try {
      const findOrderItem = await Order.findById(orderId);
      return findOrderItem;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllOrders(page = 1, limit = 10, filter = {}) {
    try {
      const skip = (page - 1) * limit;
      filter = {
        ...filter,
        active: true,
      };

      // Extract search regex to support searching by SKU / Tag No & Customer Name / Mobile
      let searchRegex = null;
      if (filter.sku) {
        searchRegex = filter.sku instanceof RegExp ? filter.sku : new RegExp(filter.sku, "i");
        delete filter.sku;
      } else if (filter.$or && Array.isArray(filter.$or)) {
        const regexCond = filter.$or.find((cond) => cond.orderId && cond.orderId.$regex);
        if (regexCond) {
          searchRegex = regexCond.orderId.$regex;
        }
      }

      if (searchRegex) {
        const Customer = mongoose.model("Customer");

        const [matchedOrderItems, matchedCustomers] = await Promise.all([
          OrderItem.find({ sku: searchRegex }).distinct("orderId"),
          Customer.find({
            $or: [
              { firstname: searchRegex },
              { lastname: searchRegex },
              { mobile: searchRegex },
            ],
          }).distinct("_id"),
        ]);

        if (!filter.$or) filter.$or = [];
        if (matchedOrderItems.length > 0) {
          filter.$or.push({ _id: { $in: matchedOrderItems } });
        }
        if (matchedCustomers.length > 0) {
          filter.$or.push({ userId: { $in: matchedCustomers } });
        }
      }

      const orders = await Order.find(filter)
        .populate("userId", "firstname lastname mobile")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await Order.countDocuments(filter);

      const orderIds = orders.map((order) => order._id);
      const cartIds = orders
        .map((order) => order.cartId)
        .filter((cartId) => cartId != null);

      const [orderItems, cartItems] = await Promise.all([
        OrderItem.find({ orderId: { $in: orderIds } })
          .select("orderId sku")
          .lean(),
        cartIds.length > 0
          ? CartItem.find({ cartId: { $in: cartIds } })
              .select("cartId sku")
              .lean()
          : Promise.resolve([]),
      ]);

      const orderItemMap = {};
      orderItems.forEach((item) => {
        const key = item.orderId.toString();
        if (!orderItemMap[key]) {
          orderItemMap[key] = [];
        }
        orderItemMap[key].push({ sku: item.sku });
      });

      const cartItemMap = {};
      cartItems.forEach((item) => {
        const key = item.cartId.toString();
        if (!cartItemMap[key]) {
          cartItemMap[key] = [];
        }
        cartItemMap[key].push({ sku: item.sku });
      });

      const ordersWithCartItems = orders.map((order) => {
        const orderIdKey = order._id ? order._id.toString() : null;
        const cartIdKey = order.cartId ? order.cartId.toString() : null;

        const items =
          orderIdKey && orderItemMap[orderIdKey] && orderItemMap[orderIdKey].length > 0
            ? orderItemMap[orderIdKey]
            : cartIdKey && cartItemMap[cartIdKey]
            ? cartItemMap[cartIdKey]
            : [];

        return {
          ...order,
          cartItems: items,
        };
      });

      return {
        orders: ordersWithCartItems,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updatePaymentCount(orderId, paymentId = null) {
    try {
      const statusData = {
        name: ORDER_STATUS["2"],
        statusNo: ORDER_STATUS_NO.PLACED,
        date: new Date(),
        remarks: "Order Placed",
      };
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            active: true,
            status: ORDER_STATUS["2"],
            orderStatus: ORDER_STATUS_NO.PLACED,
            lastStatusUpdatedDate: new Date(),
            ...(paymentId !== null && { paymentId }),
          },
          $push: { statusData: statusData },
        },
        { new: true },
      );
      await CartItem.updateMany(
        { cartId: updatedOrder.cartId },
        { $set: { is_deleted: true } },
      );
      await this.reduceProductQuatityCount(orderId);
      return updatedOrder || null;
    } catch (error) {
      console.error("Error updating payment count:", error);
      throw error;
    }
  }

  async findOrderDetailReport(orderId) {
    try {
      const findOrder = await Order.findById(orderId)
        .populate({
          path: "deliveryAddress",
          populate: [
            { path: "id_city" },
            { path: "id_state" },
            { path: "id_country" },
          ],
        })
        .populate("paymentId")
        .populate({
          path: "userId",
          select: "firstname lastname email mobile cus_img",
        })
        .lean();

      const orgData = await organisation
        .findOne({})
        .select("company_name mobile address id_city id_state id_country")
        .populate("id_city", "city_name")
        .populate("id_state", "state_name")
        .populate("id_country", "country_name")
        .lean();

      let address = "";
      if (findOrder.deliveryAddress) {
        const addr = findOrder.deliveryAddress;
        address = [
          addr.address,
          addr.landmark,
          addr.id_city?.city_name,
          addr.id_state?.state_name,
          addr.id_country?.country_name,
          addr.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      }

      const findOrderItem = await OrderItem.aggregate([
        {
          $match: { orderId: new mongoose.Types.ObjectId(orderId) },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            as: "itemDoc",
          },
        },
        {
          $unwind: {
            path: "$itemDoc",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            matchedSize: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$product.availableSizes.values",
                    as: "val",
                    cond: { $eq: ["$$val._id", "$sizeId"] },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $addFields: {
            sizeValue: "$matchedSize.sizeValue",
            sizeQuantity: "$matchedSize.quantity",
          },
        },
        {
          $project: {
            _id: 0,
            productName: "$product.product_name",
            purityName: { $ifNull: ["$purityName", ""] },
            size: { $ifNull: ["$size", "$sizeValue"] },
            qty: "$quantity",
            img: { $arrayElemAt: ["$product.product_image", 0] },
            // price: "$discountAmount",
            price: { $ifNull: ["$price", "$discountAmount"] },
            grossWt: "$grossWeight",
            netWt: "$netWt",
            totalStoneWeight: { $cond: [{ $gt: ["$totalStoneWeight", 0] }, "$totalStoneWeight", "$itemDoc.stonewt"] },
            totalDiamondWeight: { $cond: [{ $gt: ["$totalDiamondWeight", 0] }, "$totalDiamondWeight", "$itemDoc.diamondwt"] },
            totalStonePrice: "$totalStonePrice",
            totalDiamondPrice: "$totalDiamondPrice",
            metalRate: "$metalRate",
            huidNo: "$huidNo",
            huidCharges: "$huidCharges",
            diaCertificateNo: "$diaCertificateNo",
            tagNo: { $ifNull: ["$tagNo", "$itemDoc.tagNo"] },
            totalprice: "$totalPrice",
            subtotal: "$price",
            discountAmount: { $round: [{ $subtract: ["$totalPrice", "$price"] }, 1] },
            gstamount: { $ifNull: ["$gstAmount", 0] },
            onlineProduct: "$product.onlineProduct",
            soldOutStatus: "$itemDoc.status",
            priceBreakup: {
              metalValue: { $round: ["$calculations.baseMetalValue", 2] },
              makingValue: { $round: ["$makingCharges.discountedValue", 2] },
              wastageValue: { $round: ["$wastageCharges.discountedValue", 2] },
              stoneValue: {
                $round: [
                  { $add: ["$totalStonePrice", "$totalDiamondPrice"] },
                  2,
                ],
              },
              gstValue: { $round: ["$gstAmount", 4] },
              huidCharges: { $ifNull: ["$huidCharges", 0] },
            },
            makingValue: { $round: ["$makingCharges.discountedValue", 2] },
            wastageValue: { $round: ["$wastageCharges.discountedValue", 2] }
          },
        },
      ]);

      for (let i = 0; i < findOrderItem.length; i++) {
        const item = findOrderItem[i];
        if (
          !(Number(item.totalStoneWeight) || 0) &&
          !(Number(item.totalDiamondWeight) || 0) &&
          !(Number(item.totalStonePrice) || 0) &&
          !(Number(item.totalDiamondPrice) || 0) &&
          item.itemId
        ) {
          const itemDoc = await itemModel.findById(item.itemId).populate({
            path: "stoneDetails",
            populate: { path: "itemId" }
          }).lean();

          if (itemDoc && itemDoc.stoneDetails && itemDoc.stoneDetails.length > 0) {
            let tsw = 0, tdw = 0, tsp = 0, tdp = 0;
            itemDoc.stoneDetails.forEach((stone) => {
              let price = Number(stone.price || 0);
              if (price === 0 && stone.itemId && stone.itemId.percraterate) {
                price = Number(stone.weight || 0) * Number(stone.itemId.percraterate || 0) + Number(stone.itemId.charge || 0);
              }
              if (stone.type && stone.type.toLowerCase() === "diamond") {
                tdw += Number(stone.weight || 0);
                tdp += price;
              } else if (stone.type && stone.type.toLowerCase() === "stone") {
                tsw += Number(stone.weight || 0);
                tsp += price;
              }
            });

            item.totalStoneWeight = tsw;
            item.totalDiamondWeight = tdw;
            item.totalStonePrice = tsp;
            item.totalDiamondPrice = tdp;

            if (item.priceBreakup) {
              item.priceBreakup.stoneValue = Math.round((tsp + tdp) * 100) / 100;
            }
          }
        }
      }

      const computedTotalStoneWeight = findOrderItem.reduce((acc, item) => acc + (Number(item.totalStoneWeight) || 0), 0);
      const computedTotalDiamondWeight = findOrderItem.reduce((acc, item) => acc + (Number(item.totalDiamondWeight) || 0), 0);
      const computedTotalStonePrice = findOrderItem.reduce((acc, item) => acc + (Number(item.totalStonePrice) || 0), 0);
      const computedTotalDiamondPrice = findOrderItem.reduce((acc, item) => acc + (Number(item.totalDiamondPrice) || 0), 0);
      const computedTotalGstAmount = findOrderItem.reduce((acc, item) => acc + (Number(item.gstamount) || 0), 0);
      const computedTotalAmount = findOrderItem.reduce((acc, item) => acc + (Number(item.totalprice) || 0), 0);
      const computedSubTotal = findOrderItem.reduce((acc, item) => acc + (Number(item.subtotal) || Number(item.price) || 0), 0);
      const computedSavedAmount = findOrderItem.reduce((acc, item) => acc + (Number(item.discountAmount) || 0), 0);

      return {
        item: findOrderItem,
        orgData,
        overAll: {
          placedAt: findOrder.createdAt,
          estimatedDeliveryDate: findOrder.estimatedDeliveryDate,
          arrivedAt: findOrder?.statusData[findOrder.statusData.length - 1]?.date,
          orderId: findOrder.orderId,
          address,
          subTotal: computedSubTotal || findOrder.subtotal,
          totalAmount: computedTotalAmount || findOrder.totalAmount,
          actualTotalAmount: findOrder.totalAmount,
          shippingCharge: findOrder.shippingFee,
          status: findOrder.status,
          savedAmount: computedSavedAmount || findOrder.savedAmount,
          name: `${findOrder.userId.firstname} ${findOrder.userId.lastname ?? ""
            }`,
          mobile: findOrder.userId?.mobile,
          email: findOrder.userId?.email,
          cus_img: findOrder.userId?.cus_img,
          createdAt: findOrder.createdAt,
          orderStatus: findOrder.orderStatus,
          statusType: findOrder.orderStatus,
          orderstatusData: findOrder.statusData,
          orderType: findOrder.orderType,
          orderTypeNo: findOrder?.orderType,
          orderTypeName: ORDER_TYPE_NAME[findOrder.orderType],
          trackerId: findOrder.trackerId,
          trackingNo: findOrder?.trackerId,
          cancelReason: findOrder?.cancelReason,
          parcelService: findOrder.parcelService,
          deliveryRecipientName: findOrder?.deliveryAddress?.name,
          deliveryRecipientPhone: findOrder?.deliveryAddress?.mobileNo,
          totalGstAmount: findOrder?.totalGstAmount || computedTotalGstAmount,
          paymentMode: findOrder?.paymentId?.paymentModeName,
          totalStoneWeight: findOrder?.totalStoneWeight || computedTotalStoneWeight,
          totalDiamondWeight: findOrder?.totalDiamondWeight || computedTotalDiamondWeight,
          totalStonePrice: findOrder?.totalStonePrice || computedTotalStonePrice,
          totalDiamondPrice: findOrder?.totalDiamondPrice || computedTotalDiamondPrice,
        },
        productPathUrl: `${config.DISPLAY_IMG_URL}products/`,
        customerPathUrl: `${config.DISPLAY_IMG_URL}customer/`,
      };
    } catch (error) {
      console.error("Failed to get order item", error);
      throw error;
    }
  }

  async updateQuantity(productData) {
    try {
      const updateQuantity = await productModel.aggregate([{ $match: {} }]);
    } catch (error) {
      throw error;
    }
  }

  async getTopSellingProduct(filter) {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            ...filter,
            orderStatus: {
              $nin: [ORDER_STATUS_NO.CANCELLED, ORDER_STATUS_NO.PROCESSING],
            },
          },
        },

        {
          $lookup: {
            from: "orderitems", // collection name
            localField: "_id",
            foreignField: "orderId",
            as: "orderItem",
          },
        },
        { $unwind: "$orderItem" },

        // lookup product early to filter out inactive ones
        {
          $lookup: {
            from: "products",
            localField: "orderItem.productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $match: {
            "productInfo.active": true,
            "productInfo.is_deleted": { $ne: true },
          },
        },

        // group by product
        {
          $group: {
            _id: "$orderItem.productId",
            totalSold: { $sum: "$orderItem.quantity" },
            totalAmount: { $sum: "$orderItem.discountAmount" },
            totalGrossWeight: { $sum: "$orderItem.grossWeight" },
            totalNetWeight: { $sum: "$orderItem.netWt" },
            productName: { $first: "$productInfo.product_name" },
            id_metal: { $first: "$productInfo.id_metal" },
            id_category: { $first: "$productInfo.id_category" },
            id_purity: { $first: "$productInfo.id_purity" },
          },
        },

        // sort by total sold
        { $sort: { totalSold: -1 } },

        // top 10
        { $limit: 10 },

        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metal",
          },
        },
        { $unwind: { path: "$metal", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "purities",
            localField: "id_purity",
            foreignField: "_id",
            as: "purity",
          },
        },
        { $unwind: { path: "$purity", preserveNullAndEmptyArrays: true } },

        // final projection
        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: "$productName",
            totalSold: 1,
            metalName: { $ifNull: ["$metal.metal_name", ""] },
            purityName: { $ifNull: ["$purity.purity_name", ""] },
            categoryName: { $ifNull: ["$category.category_name", ""] },
            totalAmount: 1,
            totalGrossWeight: 1,
            totalNetWeight: 1,
          },
        },
      ]);

      return result;
    } catch (err) {
      console.error("Error in getTopSellingProduct:", err);
      throw err;
    }
  }

  async getTopSellingCategory(filter) {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            ...filter,
            orderStatus: {
              $nin: [ORDER_STATUS_NO.CANCELLED, ORDER_STATUS_NO.PROCESSING],
            },
          },
        },

        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItem",
          },
        },
        { $unwind: "$orderItem" },

        // join product to get categoryId
        {
          $lookup: {
            from: "products",
            localField: "orderItem.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },

        // group by categoryId
        {
          $group: {
            _id: "$product.id_category",
            totalSold: { $sum: "$orderItem.quantity" },
          },
        },

        // sort by total sold
        { $sort: { totalSold: -1 } },

        // top 10 categories
        { $limit: 10 },

        // lookup category details
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },

        // final projection
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            categoryName: "$category.category_name",
            totalSold: 1,
          },
        },
      ]);

      return result;
    } catch (err) {
      console.error("Error in getTopSellingCategory:", err);
      throw err;
    }
  }

  async findOrderStatus() {
    try {
      return await orderStatusModel.find({});
    } catch (error) {
      return null;
    }
  }

  async findStatusByNo(statusNo) {
    try {
      return await orderStatusModel.findOne({
        statusNo: Number(statusNo),
        isDeleted: { $ne: true },
      });
    } catch (error) {
      return null;
    }
  }

  async findStatusById(id) {
    try {
      return await orderStatusModel.findOne({ _id: id });
    } catch (error) {
      return null;
    }
  }

  async getOverAllReport(startDate, endDate) {
    try {
      const result = await Order.aggregate([
        { $match: { active: true } },
        {
          $facet: {
            newOrders: [
              {
                $match: {
                  orderStatus: { $ne: ORDER_STATUS_NO.CANCELLED },
                  createdAt: { $gte: startDate, $lte: endDate },
                },
              },
              { $count: "count" },
            ],
            pendingOrders: [
              {
                $match: {
                  orderStatus: ORDER_STATUS_NO.PLACED, // Payment pending
                  createdAt: { $gte: startDate, $lte: endDate },
                },
              },
              { $count: "count" },
            ],
            deliveredToday: [
              {
                $match: {
                  orderStatus: ORDER_STATUS_NO.DELIVERED,
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          { $arrayElemAt: ["$statusData.date", -1] },
                          startDate,
                        ],
                      },
                      {
                        $lte: [
                          { $arrayElemAt: ["$statusData.date", -1] },
                          endDate,
                        ],
                      },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],

            inShipment: [
              {
                $match: {
                  orderStatus: ORDER_STATUS_NO.SHIPPED,
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          { $arrayElemAt: ["$statusData.date", -1] },
                          startDate,
                        ],
                      },
                      {
                        $lte: [
                          { $arrayElemAt: ["$statusData.date", -1] },
                          endDate,
                        ],
                      },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],
            totalSales: [
              {
                $match: {
                  orderType: {
                    $in: [ORDER_TYPE.ONLINE_ORDER, ORDER_TYPE.STORE_PICKUP],
                  },
                  orderStatus: { $ne: ORDER_STATUS_NO.CANCELLED },
                  createdAt: { $gte: startDate, $lte: endDate },
                },
              },
              {
                $lookup: {
                  from: "orderitems",
                  localField: "_id",
                  foreignField: "orderId",
                  as: "items",
                },
              },
              { $unwind: "$items" },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$items.price" },
                  totalGrossWeight: { $sum: "$items.grossWeight" },
                  totalNetWeight: { $sum: "$items.netWt" },
                },
              },
            ],
            enquiries: [
              {
                $match: {
                  orderStatus: ORDER_STATUS_NO.PROCESSING,
                  orderType: ORDER_TYPE.OFFLINE_ORDER,
                  createdAt: { $gte: startDate, $lte: endDate },
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            newOrders: {
              $ifNull: [{ $arrayElemAt: ["$newOrders.count", 0] }, 0],
            },
            pendingOrders: {
              $ifNull: [{ $arrayElemAt: ["$pendingOrders.count", 0] }, 0],
            },
            deliveredToday: {
              $ifNull: [{ $arrayElemAt: ["$deliveredToday.count", 0] }, 0],
            },
            inShipment: {
              $ifNull: [{ $arrayElemAt: ["$inShipment.count", 0] }, 0],
            },
            totalSales: {
              $ifNull: [{ $arrayElemAt: ["$totalSales.total", 0] }, 0],
            },
            totalGrossWeight: {
              $ifNull: [
                { $arrayElemAt: ["$totalSales.totalGrossWeight", 0] },
                0,
              ],
            },
            totalNetWeight: {
              $ifNull: [{ $arrayElemAt: ["$totalSales.totalNetWeight", 0] }, 0],
            },
            enquiries: {
              $ifNull: [{ $arrayElemAt: ["$enquiries.count", 0] }, 0],
            },
          },
        },
      ]);

      return result;
    } catch (err) {
      console.error("Error in getTopSellingCategory:", err);
      throw err;
    }
  }

  async changeOrderStatus(statusId, orderId, statusData) {
    try {
      const findStatus = await orderStatusModel.findById(statusId);
      if (!findStatus) {
        throw new Error("Invalid status ID");
      }

      // Prepare update object
      let updateData = {
        status: findStatus.name,
        orderStatus: findStatus.statusNo,
        lastStatusUpdatedDate: statusData.date,
      };
      if (findStatus.statusNo === ORDER_STATUS_NO.SHIPPED) {
        ((updateData.trackerId = statusData.trackerId),
          (updateData.parcelService = statusData.parcelService));
      }

      if (findStatus.statusNo === ORDER_STATUS_NO.CANCELLED) {
        updateData.cancelReason = statusData.cancelReason;
      }

      // If Delivered → add deliveredDate
      if (findStatus.statusNo === ORDER_STATUS_NO.DELIVERED) {
        updateData.deliveredDate = new Date();
      }

      // ✅ Push new status record into statusData array
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: updateData,
          $push: {
            statusData,
          },
        },
        { new: true },
      );

      if (findStatus.statusNo == ORDER_STATUS_NO.CANCELLED) {
        await this.increaseProductQuatityCount(orderId);
      }

      return order;
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  }

  async getProductCountsByOrder(orderObjectId) {
    try {
      return await this.orderItemModel.aggregate([
        {
          $match: { orderObjectId: orderObjectId },
        },
        {
          $group: {
            _id: "$productId",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            count: 1,
          },
        },
      ]);
    } catch (error) {
      console.error("Repo Error in getProductCountsByOrder:", error);
      throw error;
    }
  }

  async getPaymentReport(page = 1, limit = 10, filter = {}, search = "") {
    try {
      page = Number(page);
      limit = Number(limit);
      const skip = (page - 1) * limit;

      const pipeline = [
        // ----------------------------
        // MATCH ORDERS
        // ----------------------------
        {
          $match: {
            ...filter,
            paymentId: { $exists: true, $ne: null },
          },
        },

        // ----------------------------
        // JOIN PAYMENT INFO
        // ----------------------------
        {
          $lookup: {
            from: "orderpaymens",
            localField: "paymentId",
            foreignField: "_id",
            as: "payment",
          },
        },
        { $unwind: "$payment" },

        // ----------------------------
        // ONLY SUCCESSFUL PAYMENTS
        // ----------------------------
        {
          $match: {
            "payment.payment_status": 1, // ✅ Fixed field name
            "payment.payment_amount": { $gt: 0 },
          },
        },

        // ----------------------------
        // JOIN CUSTOMER INFO
        // ----------------------------
        {
          $lookup: {
            from: "customers",
            localField: "userId",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
      ];

      // ----------------------------
      // SEARCH CONDITIONS
      // ----------------------------
      if (search && search.trim() !== "") {
        const regex = new RegExp(search.trim(), "i");
        pipeline.push({
          $match: {
            $or: [
              { orderId: { $regex: regex } },
              { "customer.firstname": { $regex: regex } },
              { "customer.lastname": { $regex: regex } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$customer.mobile" },
                    regex,
                  },
                },
              },
            ],
          },
        });
      }

      // ----------------------------
      // COUNT TOTAL
      // ----------------------------
      const countPipeline = [...pipeline, { $count: "totalCount" }];
      const countResult = await Order.aggregate(countPipeline);
      const totalCount = countResult?.[0]?.totalCount || 0;

      // ----------------------------
      // PAGINATION
      // ----------------------------
      pipeline.push({ $sort: { createdAt: -1 } });
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });

      // ----------------------------
      // FINAL PROJECTION
      // ----------------------------
      pipeline.push({
        $project: {
          _id: 1,
          orderId: 1,
          createdAt: 1,
          totalAmount: 1,
          payment_amount: "$payment.payment_amount",
          cf_payment_id: "$payment.cf_payment_id",
          cf_order_id: "$payment.cf_order_id",
          payment_session_id: "$payment.payment_session_id",
          payment_status: "$payment.payment_status",
          paymentModeName: "$payment.paymentModeName",
          id_transaction: "$payment.id_transaction",
          id_customer: {
            _id: "$customer._id",
            firstname: "$customer.firstname",
            lastname: "$customer.lastname",
            mobile: "$customer.mobile",
          },
        },
      });

      // ----------------------------
      // RUN FINAL PIPELINE
      // ----------------------------
      const result = await Order.aggregate(pipeline);

      return {
        result,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getTopSellingProducttable(
    page = 1,
    limit = 10,
    filter = {},
    search = "",
  ) {
    try {
      const skip = (page - 1) * limit;
      const { id_category, ...orderFilter } = filter;
      console.log(filter)

      let basePipeline = [
        {
          $match: {
            ...orderFilter,
            orderStatus: {
              $nin: [ORDER_STATUS_NO.CANCELLED, ORDER_STATUS_NO.PROCESSING],
            },
          },
        },

        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItem",
          },
        },
        { $unwind: "$orderItem" },

        // lookup product early to filter out inactive ones
        {
          $lookup: {
            from: "products",
            localField: "orderItem.productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $match: {
            "productInfo.active": true,
            "productInfo.is_deleted": { $ne: true },
            // "productInfo.onlineProduct": { $eq: true },
          },
        },

        {
          $group: {
            _id: "$orderItem.productId",
            totalSold: { $sum: "$orderItem.quantity" },
            totalAmount: { $sum: "$orderItem.price" },
            totalGrossWeight: { $sum: "$orderItem.grossWeight" },
            totalNetWeight: { $sum: "$orderItem.netWt" },
            purityName: { $first: "$orderItem.purityName" },
            productName: { $first: "$productInfo.product_name" },
            productType: { $first: "$productInfo.onlineProduct" },
            id_metal: { $first: "$productInfo.id_metal" },
            id_category: { $first: "$productInfo.id_category" },
            id_purity: { $first: "$productInfo.id_purity" },
            tagNumber: { $first: "$productInfo.code" },
            totalPrice: { $first: "$orderItem.totalPrice" },
            customerPhone: { $first: "$phone" },

          },
        },
      ];

      // //  CATEGORY FILTER
      // if (id_category) {
      //   basePipeline.push({
      //     $match: {
      //       id_category: new mongoose.Types.ObjectId(filter.id_category),
      //     },
      //   });
      // }

      // JOIN metadata
      basePipeline.push(
        {
          $lookup: {
            from: "metals",
            localField: "id_metal",
            foreignField: "_id",
            as: "metal",
          },
        },
        { $unwind: { path: "$metal", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "categories",
            localField: "id_category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "purities",
            localField: "id_purity",
            foreignField: "_id",
            as: "purity",
          },
        },
        { $unwind: { path: "$purity", preserveNullAndEmptyArrays: true } },

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
                      { $eq: ["$status", 2] }, // Sold
                      { $ne: ["$is_deleted", true] },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "soldData",
          },
        },
        // {
        //   $match: {
        //     soldData: { $ne: [] }
        //   }
        // },


        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: "$productName",
            totalSold: 1,
            metalName: { $ifNull: ["$metal.metal_name", ""] },
            purityName: { $ifNull: ["$purityName", "$purity.purity_name", ""] },
            categoryName: { $ifNull: ["$category.category_name", ""] },
            totalAmount: 1,
            totalGrossWeight: 1,
            totalPrice: 1,
            totalNetWeight: 1,
            productType: 1,
            tagNumber: 1,
            customerPhone: 1, // <-- add
            totalStock: {
              $ifNull: [{ $arrayElemAt: ["$stockData.count", 0] }, 0],
            },
          },
        },
      );

      // 🔍 SEARCH FILTER
      if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search.trim(), "i");

        basePipeline.push({
          $match: {
            $or: [
              { name: { $regex: searchRegex } },
              { tagNumber: { $regex: searchRegex } },
              { metalName: { $regex: searchRegex } },
            ],
          },
        });
      }

      // 🎯 APPLY FACET FOR PAGINATION
      const pipeline = [
        ...basePipeline,

        {
          $facet: {
            metadata: [{ $count: "totalDocuments" }],
            data: [
              { $sort: { totalSold: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
          },
        },

        {
          $addFields: {
            totalDocuments: { $arrayElemAt: ["$metadata.totalDocuments", 0] },
          },
        },
      ];

      const response = await Order.aggregate(pipeline);

      const result = response[0].data || [];
      const totalDocuments = response[0].totalDocuments || 0;
      const totalPages = Math.ceil(totalDocuments / limit);

      return {
        result,
        totalDocuments,
        totalPages,
        currentPage: page,
        limit,
      };
    } catch (err) {
      console.error("Error in getTopSellingProducttable:", err);
      throw err;
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
            orderType: "$Order.orderType",
            orderStatus: "$Order.orderStatus",
          },
        },
      ]);

      const hasActiveOrder = result.some(
        (item) =>
          item.orderType === ORDER_TYPE.OFFLINE_ORDER &&
          item.orderStatus === ORDER_STATUS_NO.PROCESSING,
      );

      return { alreadyOrdered: hasActiveOrder };
    } catch (error) {
      throw error;
    }
  }

  async findItemForOrderNow(itemId, userId) {
    try {
      const result = await OrderItem.aggregate([
        {
          $match: {
            itemId: new mongoose.Types.ObjectId(itemId),
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
            orderType: "$Order.orderType",
            orderStatus: "$Order.orderStatus",
          },
        },
      ]);

      const hasActiveOrder = result.some(
        (item) =>
          item.orderType === ORDER_TYPE.OFFLINE_ORDER &&
          item.orderStatus === ORDER_STATUS_NO.PROCESSING,
      );

      return { alreadyOrdered: hasActiveOrder };
    } catch (error) {
      throw error;
    }
  }

  async reduceProductQuatityCount(orderId) {
    try {
      console.log(orderId)
      const orderItems = await OrderItem.find({ orderId }).lean();

      if (!orderItems.length) {
        console.error("No items found for this order.");
        return;
      }

      for (const orderItem of orderItems) {
        const product = await productModel.findById(orderItem.productId).lean();
        if (product && product.onlineProduct === false) {
          console.log(
            `Skipping stock reduction for product ${product.product_name} because onlineProduct is false`,
          );
          continue;
        }

        let itemToReduce;
        if (orderItem.itemId) {
          itemToReduce = await itemModel.findOne({
            _id: orderItem.itemId,
            status: 1,
          });
        } else {
          itemToReduce = await itemModel.findOne({
            productId: orderItem.productId,
            sizeId: orderItem.sizeId,
            status: 1, // Available
            active: true,
          });
        }

        if (itemToReduce) {
          await itemModel.findByIdAndUpdate(itemToReduce._id, {
            $set: { status: 2 }, // Mark as Out/Sold and Inactive
          });

          await productModel.findByIdAndUpdate(orderItem.productId, {
            $set: { onlineProduct: false },
          });

          console.error(`✅ Item ${itemToReduce.tagNo} marked as sold.`);
        } else {
          console.warn(
            `⚠️ No available item found for Product: ${orderItem.productId}, Item: ${orderItem.itemId}`,
          );
        }
      }
    } catch (err) {
      console.error("Error in reduceProductQuatityCount:", err);
      throw err;
    }
  }

  async increaseProductQuatityCount(orderId) {
    try {
      // Step 1: Fetch all order items
      const orderItems = await OrderItem.find({ orderId }).lean();

      if (!orderItems.length) {
        console.error("No items found for this order.");
        return;
      }

      for (const orderItem of orderItems) {
        const product = await productModel.findById(orderItem.productId).lean();
        if (product && product.onlineProduct === false) {
          continue;
        }

        let itemToIncrease;
        if (orderItem.itemId) {
          itemToIncrease = await itemModel.findOne({
            _id: orderItem.itemId,
            status: 2,
          });
        } else {
          itemToIncrease = await itemModel.findOne({
            productId: orderItem.productId,
            sizeId: orderItem.sizeId,
            status: 2, // Out/Sold
          });
        }

        if (itemToIncrease) {
          await itemModel.findByIdAndUpdate(itemToIncrease._id, {
            $set: { status: 1, active: true }, // Mark as In/Available and Active
          });
          console.error(`✅ Item ${itemToIncrease.tagNo} returned to stock.`);
        }
      }
    } catch (err) {
      console.error("Error in increaseProductQuatityCount:", err);
      throw err;
    }
  }
}

export default OrderRepository;
