import OrderPaymentUsecase from "../../ecom/orderPaymentUsecase.js";
import crypto from "crypto";
import config from "../../../config/chit/env.js";
import EcomPaymentOrderRepository from "../../../infrastructure/repositories/ecom/ecomPaymentOrderRepository.js";
import axios from "axios";
import SchemeAccountRepository from "../../../infrastructure/repositories/chit/schemeAccountRepository.js";
import moment from "moment-timezone";
import smsService from "../../../config/chit/smsService.js";
import SaveNotificationRepo from "../../../infrastructure/repositories/chit/saveNotificationRepo.js";
import SaveNotificationUsecase from "../chit/client/saveNotificationUsecase.js";
import {
  ORDER_STATUS,
  ORDER_STATUS_NO,
  ORDER_TYPE,
  ORDER_TYPE_NAME,
} from "../../../config/chit/const.js";
import { checkQuantitySize } from "../../../utils/quantityCheckHelper.js";

class OrderUseCase {
  constructor(
    cartRepository,
    productRepository,
    orderRepository,
    shipRocketUseCase,
    pincodeUseCase,
    deliveryAddressRepository,
    itemRepository
  ) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.shipRocketUseCase = shipRocketUseCase;
    this.pincodeUseCase = pincodeUseCase;
    this.deliveryAddressRepository = deliveryAddressRepository;
    this.itemRepository = itemRepository;

    this.baseUrl = config.CASH_FREE_URL || "https://sandbox.cashfree.com";
    this.url = `${this.baseUrl}/pg/orders`;
    (this.mail = "test@gmail.com"), (this.password = "12345");
    this.orderpaymentUsecase = new OrderPaymentUsecase();
    this.ecomPaymentReopo = new EcomPaymentOrderRepository();
    this.schemeAccountRepo = new SchemeAccountRepository();
    this.saveNotificationRepo = new SaveNotificationRepo();
    this.saveNotificationUsecase = new SaveNotificationUsecase(
      this.saveNotificationRepo
    );
  }

  async getDateRange(fromDate, toDate) {
    let startDate, endDate;

    if (fromDate && toDate) {
      startDate = new Date(fromDate);
      startDate.setHours(0, 0, 0, 0); // 12:00 AM IST

      endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999); // 11:59 PM IST
    } else {
      // Default: today
      const today = new Date();
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  }

  async sendNotification(customerId, title, message) {
    const inputMsg = {
      recipients: [customerId],
      title: title,
      message: message,
      channel: "push",
    };
    await smsService.sendNotification(inputMsg);
    await this.saveNotificationUsecase.saveNotification(
      {
        title: inputMsg.title,
        message: inputMsg.message,
        type: "alert",
        category: "Order",
      },
      customerId
    );
  }

  async getOrder(userData) {
    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }

      const findCart = await this.cartRepository.findCartByUserId(userData._id);
      if (!findCart) {
        return {
          success: false,
          message: "Cart not found",
        };
      }
      const cartItems = await this.cartRepository.findById(findCart._id);
      if (!cartItems) {
        return {
          success: false,
          message: "Failed to retrieve order details.",
          data: cartItems,
        };
      }
      return {
        success: true,
        message: "order details retrieved successfully.",
        data: cartItems,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to retrieve order: ${error.message}`);
    }
  }

  async orderNow(userData, addressId, productId) {
    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }
      if (!addressId) {
        throw new Error("Address Id is required");
      }
      if (!productId) {
        throw new Error("Address Id is required");
      }
      const findAddress = await this.deliveryAddressRepository.findById(
        addressId
      );

      if (!findAddress) {
        return {
          success: false,
          message: "Invalid Address Id",
        };
      }
      const findProduct = await this.productRepository.findById(productId);

      if (!findProduct && findProduct.onlineProduct) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      const findProductForOrderNow =
        await this.orderRepository.findProductForOrderNow(
          productId,
          userData._id
        );
      if (findProductForOrderNow.alreadyOrdered) {
        return {
          success: false,
          message:
            "Order confirmation is pending. You can place a new order after it's confirmed.",
        };
      }

      const cartData = {};
      const findCart = await this.cartRepository.findByUserId(userData._id);
      let cartId = findCart && findCart._id ? findCart._id : null;
      cartData.userId = userData._id;
      if (!findCart) {
        const cart = {
          ...cartData,
          status: "active",
        };
        const createCart = await this.cartRepository.create(cart);
        cartId = createCart._id;
      }

      const shppingCharge = 0;
      const raw = `${userData._id}${Date.now()}`;
      const transactionId = crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex")
        .slice(0, 15);
      const processingStatus = await this.orderRepository.findStatusByNo(ORDER_STATUS_NO.PROCESSING);

      const orderData = {
        orderId: `ORD-${transactionId}`,
        userId: userData._id,
        phone: userData?.mobile,
        cartId: findCart?._id || null,
        shipping_is_billing: true,
        itemsCount: 1,
        subtotal: findProduct.totalAmount || findProduct.price || 0,
        totalDiscount: findProduct.discountedAmount || findProduct.price || 0,
        shippingFee: shppingCharge,
        totalAmount: (findProduct.discountedAmount || findProduct.price || 0) + shppingCharge,
        savedAmount: (findProduct.totalAmount || findProduct.price || 0) - (findProduct.discountedAmount || findProduct.price || 0),
        status: processingStatus?.name || "Processing",
        deliveryAddress: addressId,
        active: true,
        orderStatus: ORDER_STATUS_NO.PROCESSING,
        orderType: ORDER_TYPE.OFFLINE_ORDER,
      };
      const orderItems = {
        productId: findProduct._id,
        itemId: findProduct.firstItem?._id || findProduct.items?.[0]?._id, 
        productName: findProduct.product_name,
        sku: findProduct.sku,
        image: findProduct.product_image[0],
        grossWeight: findProduct.grossWeight || findProduct.firstItem?.grossWt,
        price: findProduct.price || findProduct.totalAmount || 0,
        quantity: 1,
        discountAmount: findProduct.discountedAmount || findProduct.price || 0,
        categoryId: findProduct.id_category,
        subCategoryId: findProduct.subcategoryId,
        collectionId: findProduct.collectionId,
        status: "pending",
        trackingNumber: null,
        shippedAt: new Date(),
        returnStatus: "none",
        refundAmount: 0,
        metalRate: findProduct?.latestMetalPrice,
        netWt: findProduct?.netWeight || findProduct.firstItem?.netWeight,
        id_purity: findProduct.id_purity || findProduct.firstItem?.id_purity,
        purityName: findProduct.purityName,
        id_metal: findProduct.id_metal,
        makingCharges: findProduct.makingCharges ?? null,
        wastageCharges: findProduct.wastageCharges ?? null,
        gstAmount: findProduct.gstValue || findCart?.gst || 0,
      };
      const createOrder = await this.orderRepository.createOrder(orderData, [
        orderItems,
      ]);

      if (!createOrder) {
        return {
          success: false,
          message: "Failed to create order now",
        };
      }

      // Reduce stock immediately for offline orders
      await this.orderRepository.reduceProductQuatityCount(createOrder.order._id);

      return {
        success: true,
        message: "Your order has been placed successfully",
        data: createOrder?.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  async orderNowItem(userData, addressId, itemId) {
    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }
      if (!addressId) {
        throw new Error("Address Id is required");
      }
      if (!itemId) {
        throw new Error("Item Id is required");
      }
      const findAddress = await this.deliveryAddressRepository.findById(
        addressId
      );

      if (!findAddress) {
        return {
          success: false,
          message: "Invalid Address Id",
        };
      }
      const findItem = await this.itemRepository.findById(itemId);

      if (!findItem) {
        return {
          success: false,
          message: "Item not found",
        };
      }

      const findProduct = await this.productRepository.findById(findItem.productId);

      if (!findProduct && findProduct.onlineProduct) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      const findProductForOrderNow =
        await this.orderRepository.findProductForOrderNow(
          findProduct._id,
          userData._id
        );
      if (findProductForOrderNow.alreadyOrdered) {
        return {
          success: false,
          message:
            "Order confirmation is pending. You can place a new order after it's confirmed.",
        };
      }

      const cartData = {};
      const findCart = await this.cartRepository.findByUserId(userData._id);
      let cartId = findCart && findCart._id ? findCart._id : null;
      cartData.userId = userData._id;
      if (!findCart) {
        const cart = {
          ...cartData,
          status: "active",
        };
        const createCart = await this.cartRepository.create(cart);
        cartId = createCart._id;
      }

      const shppingCharge = 0;
      const raw = `${userData._id}${Date.now()}`;
      const transactionId = crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex")
        .slice(0, 15);
      const processingStatus = await this.orderRepository.findStatusByNo(ORDER_STATUS_NO.PROCESSING);

      const orderData = {
        orderId: `ORD-${transactionId}`,
        userId: userData._id,
        phone: userData?.mobile,
        cartId: findCart?._id || null,
        shipping_is_billing: true,
        itemsCount: 1,
        subtotal: findItem.totalprice || findProduct.totalAmount || findProduct.price || 0,
        totalDiscount: findProduct.discountedAmount || findProduct.price || 0, 
        shippingFee: shppingCharge,
        totalAmount: (findItem.totalprice || findProduct.discountedAmount || findProduct.price || 0) + shppingCharge,
        savedAmount: (findProduct.totalAmount || findProduct.price || 0) - (findProduct.discountedAmount || findProduct.price || 0),
        status: processingStatus?.name || "Processing",
        deliveryAddress: addressId,
        active: true,
        orderStatus: ORDER_STATUS_NO.PROCESSING,
        orderType: ORDER_TYPE.OFFLINE_ORDER,
      };
      const orderItems = {
        productId: findProduct._id,
        itemId: findItem._id,
        sizeId: findItem.size,
        productName: findProduct.product_name,
        sku: findItem.tagNo || findProduct.sku,
        image: findProduct.product_image[0],
        grossWeight: findItem.grossWt,
        price: findItem.totalprice || findProduct.totalAmount || findProduct.price || 0,
        quantity: 1,
        discountAmount: findProduct.discountedAmount || findProduct.price || 0,
        categoryId: findProduct.id_category,
        subCategoryId: findProduct.subcategoryId,
        collectionId: findProduct.collectionId,
        status: "pending",
        trackingNumber: null,
        shippedAt: new Date(),
        returnStatus: "none",
        refundAmount: 0,
        metalRate: findItem.currentMetalRate || findProduct?.latestMetalPrice,
        netWt: findItem.netWeight || findProduct?.netWeight,
        id_purity: findItem.id_purity || findProduct.id_purity || findProduct.firstItem?.id_purity,
        purityName: findItem.purityName,
        id_metal: findProduct.id_metal,
        makingCharges: findItem.makingCharges || findProduct.makingCharges || null,
        wastageCharges: findItem.wastageCharges || findProduct.wastageCharges || null,
        gstAmount: findItem.gst || findProduct.gstValue || findCart?.gst || 0,
        huidNo: findItem.huidNo || null,
        huidCharges: findItem.huidCharges || 0,
        diaCertificateNo: findItem.diaCertificateNo || null,
        size: `${findItem.sizeValue || ""}${findItem.unit || ""}`,
      };
      const createOrder = await this.orderRepository.createOrder(orderData, [
        orderItems,
      ]);

      if (!createOrder) {
        return {
          success: false,
          message: "Failed to create order now",
        };
      }

      // Reduce stock immediately for offline orders
      await this.orderRepository.reduceProductQuatityCount(createOrder.order._id);

      return {
        success: true,
        message: "Your order has been placed successfully",
        data: createOrder?.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  async placeOrder(
    userData,
    addressId,
    token,
    isStorePickup
  ) {  
    try {
      if (!token._id) {
        throw new Error("User ID not found");
      }
      if (!addressId) {
        throw new Error("Address Id is required");
      }
      const findAddress = await this.deliveryAddressRepository.findById(
        addressId
      );

      if (!findAddress) {
        return {
          success: false,
          message: "Invalid Address Id",
        };
      }
      const findCart = await this.cartRepository.findCartByUserId(token._id);

      if (!findCart) {
        return {
          success: false,
          message: "Cart not found",
        };
      }

      const cartItems = await this.cartRepository.findById(findCart._id);
      if (!cartItems) {
        return {
          success: false,
          message: "Failed to retrieve order details.",
          data: cartItems,
        };
      }

      const findAvailableStocks = checkQuantitySize(cartItems.items);
      const isOutOfStock = findAvailableStocks?.some(
        (item) => item.stockAvailable === false
      );

      if (isOutOfStock) {
        return { success: false, message: "Product out of stock" };
      }

      let estimatedDeliveryDays;
      if (!isStorePickup) {
        const findPincodeData = await this.pincodeUseCase.getPincodesByFilters({
          pincode: findAddress.pincode,
        });
        const pincodeData = findPincodeData[0];
        if (!pincodeData || !pincodeData.isDeliveryAvailable) {
          return {
            success: false,
            message: "Delivery is not available for this pincode",
          };
        }
        estimatedDeliveryDays = pincodeData?.estimatedDeliveryDays;
      }

      const isPaid = true;
      if (!isPaid) {
        return {
          success: false,
          message: "Payment Failed",
        };
      }
      const shppingCharge = 0;
      const raw = `${userData._id}${Date.now()}`;
      const transactionId = crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex")
        .slice(0, 15);

      const totals = cartItems.items.reduce(
        (acc, item) => {
          acc.totalDiamondWeight += item.totalDiamondWeight || 0;
          acc.totalStoneWeight += item.totalStoneWeight || 0;
          acc.totalDiamondPrice += item.totalDiamondPrice || 0;
          acc.totalStonePrice += item.totalStonePrice || 0;
          return acc;
        },
        {
          totalDiamondWeight: 0,
          totalStoneWeight: 0,
          totalDiamondPrice: 0,
          totalStonePrice: 0,
        }
      );

      const orderData = {
        orderId: `ORD-${transactionId}`,
        userId: userData._id,
        phone: userData?.mobile,
        cartId: findCart._id,
        shipping_is_billing: true,
        itemsCount: cartItems.items.length,
        subtotal: cartItems.overAllAmount?.subTotal || cartItems.overAllAmount?.totalPrice || 0,
        totalDiscount: cartItems.overAllAmount?.totalDiscount || 0,
        shippingFee: shppingCharge,
        totalAmount: cartItems.overAllAmount?.totalAmount || 0,
        totalGstAmount: cartItems.overAllAmount?.totalGstAmount || cartItems.overAllAmount?.gstRate || 0,
        savedAmount:
          (cartItems.overAllAmount?.subTotal || 0) -
          (cartItems.overAllAmount?.totalAmount || 0) > 0 ? (cartItems.overAllAmount?.subTotal || 0) - (cartItems.overAllAmount?.totalAmount || 0) : 0,
        status: "Payment Pending",
        deliveryAddress: addressId,
        estimatedDeliveryDays,
        active: false,
        orderType: isStorePickup
          ? ORDER_TYPE.STORE_PICKUP
          : ORDER_TYPE.ONLINE_ORDER,
        totalDiamondWeight: totals.totalDiamondWeight,
        totalStoneWeight: totals.totalStoneWeight,
        totalDiamondPrice: totals.totalDiamondPrice,
        totalStonePrice: totals.totalStonePrice,
      };

      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        return {
          success: false,
          message: "Unable to calculate order total. Please verify item prices.",
        };
      }

      const orderItems = cartItems.items.map((item) => ({
        productId: item.productId,
        itemId: item.itemId,
        sizeId: item.sizeId,
        productName: item.productName,
        sku: item.sku,
        image: item.productImg,
        grossWeight: item.grossWt,
        price: item.price,
        quantity: item.qty,
        discountAmount: item.discount,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        collectionId: item.collectionId,
        status: "pending",
        trackingNumber: null,
        shippedAt: new Date(),
        estimatedDeliveryDays,
        returnStatus: "none",
        refundAmount: 0,
        metalRate: item.metalRate,
        netWt: item.netWt,
        id_purity: item.id_purity,
        purityName: item.purityName,
        id_metal: item.id_metal,
        makingCharges: item.makingCharges ?? null,
        wastageCharges: item.wastageCharges ?? null,
        gstAmount: item?.gstRate,
        totalDiamondWeight: item.totalDiamondWeight,
        totalStoneWeight: item.totalStoneWeight,
        totalDiamondPrice: item.totalDiamondPrice,
        totalStonePrice: item.totalStonePrice,
        huidNo: item.huidNo || null,
        huidCharges: item.huidCharges || 0,
        diaCertificateNo: item.diaCertificateNo || null,
        size: item.productSize || null,
      }));
      const createOrder = await this.orderRepository.createOrder(
        orderData,
        orderItems
      );

      const paymentData = await this.orderpaymentUsecase.orderPaymentCreation(
        createOrder,
        token
      );

      if (!paymentData) {
        return {
          success: false,
          message: "Failed to create order",
        };
      }

      return {
        success: true,
        message: "Your order has been placed successfully",
        data: paymentData?.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  async getMyOrder(userData) {
    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }

      const findOrders = await this.orderRepository.findOrders(userData._id);

      if (!findOrders) {
        return {
          success: false,
          message: "Failed to get orders",
        };
      }

      return {
        success: true,
        message: "order retrieved successfully.",
        data: findOrders,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  async getOrderItems(userData, orderId) {
    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }
      if (!orderId) {
        throw new Error("Order id required");
      }

      const findOrder = await this.orderRepository.findById(orderId);
      if (!findOrder) {
        return {
          success: false,
          message: "Order not found",
        };
      }
      const findOrderItems = await this.orderRepository.findOrderItems(
        findOrder._id
      );
      if (!findOrderItems) {
        return {
          success: false,
          message: "Failed to get orders",
        };
      }
      findOrderItems.overAll.orderType = ORDER_TYPE_NAME[findOrder.orderType];
      return {
        success: true,
        message: "order retrieved successfully.",
        data: findOrderItems,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  async getAllOrders({
    page,
    limit,
    search,
    from_date,
    to_date,
    orderStatus,
    orderType,
  }) {
    page = page || 1;
    limit = limit || 10;
    let filter = {};

    const fromDate = from_date;
    const toDate = to_date;

    try {
      if (orderStatus) {
        filter.orderStatus = orderStatus;
      }
      if (orderType) {
        filter.orderType = orderType;
      }

      if (fromDate && toDate) {
        if (new Date(toDate) < new Date(fromDate)) {
          throw new Error("End date cannot be before start date");
        }

        const startDate = moment
          .tz(from_date, "Asia/Kolkata")
          .startOf("day")
          .toDate();
        const endDate = moment
          .tz(to_date, "Asia/Kolkata")
          .endOf("day")
          .toDate();

        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      } else {
        const startDate = moment
          .tz(new Date(), "Asia/Kolkata")
          .startOf("day")
          .toDate();
        const endDate = moment
          .tz(new Date(), "Asia/Kolkata")
          .endOf("day")
          .toDate();

        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search.trim(), "i");

        filter.$or = [
          { status: { $regex: searchRegex } },
          { orderId: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
        ];
      }

      const orders = await this.orderRepository.getAllOrders(
        page,
        limit,
        filter
      );

      if (!orders) {
        return {
          success: false,
          message: "Failed to get orders",
        };
      }
      return {
        success: true,
        message: "Orders retrived successuly",
        data: orders,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  async webhook(data) {
    try {
      const secretKey = config.CASHFREE_SECRET;

      if (!secretKey) {
        console.error("SECRET_KEY is missing in environment variables.");
        return { status: false, message: "Secret key is not configured" };
      }

      const signature = data.headers["x-webhook-signature"];
      const payload = data.rawBody;
      const body = data.headers["x-webhook-timestamp"] + payload;

      if (!payload) {
        console.error("Raw payload is undefined");
        return { message: "Invalid payload" };
      }

      const generatedSignature = crypto
        .createHmac("sha256", secretKey)
        .update(body)
        .digest("base64");

      if (signature !== generatedSignature) {
        console.error("Invalid Signature: Possible spoofing attempt.");
        return { status: false, message: "Payment verification failed" };
      }

      await this.orderpaymentUsecase.completePayment(data.body);

      return { status: true, message: "Webhook received successfully" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error while getting payment" };
    }
  }

  async verifyPaymentStatus(req) {
    try {
      const { orderid } = req.query;
      const orderData = await this.ecomPaymentReopo.findOne({
        orderId: orderid,
      });

      if (!orderData) {
        return { success: false, message: "No order records found" };
      }

      const paymetStatus = await this.getOrderStatus(orderid);

      let status = false;
      if (paymetStatus?.order_status === "PAID") {
        status = true;
      }

      if (paymetStatus)
        return {
          success: true,
          message: "Payment data fetched successfully",
          data: status,
        };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error while getting payment" };
    }
  }

  async getOrderStatus(orderid) {
    try {
      const url = `${this.url}/${orderid}`;
      const headers = {
        "Content-Type": "application/json",
        "x-client-id": config.CASHFREE_CLIENT_ID,
        "x-client-secret": config.CASHFREE_SECRET,
        "x-api-version": config.API_VERSION,
      };

      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error while getting status" };
    }
  }

  async getOrderItemReport(orderId) {
    try {
      const findOrder = await this.orderRepository.findById(orderId);
      if (!findOrder) {
        return {
          success: false,
          message: "Order not found",
        };
      }
      const result = await this.orderRepository.findOrderDetailReport(orderId);
      if (!result) {
        return {
          success: false,
          message: "Failed to get order item report",
        };
      }
      return {
        success: true,
        message: "Successfully retrieved order report",
        data: result,
      };
    } catch (error) {
      return { success: false, message: "Error while getting item report" };
    }
  }

  async getTopSellingProduct(fromDate, toDate) {
    try {
      const { startDate, endDate } = await this.getDateRange(fromDate, toDate);
      const filter = {
        active: true,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };

      const result = await this.orderRepository.getTopSellingProduct(filter);
      if (!result) {
        return {
          success: false,
          message: "Failed to get order product wise report",
        };
      }
      return {
        success: true,
        message: "Successfully retrieved order product wise report",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error while getting order product wise report",
      };
    }
  }

  async getTopSellingCategory(fromDate, toDate) {
    try {
      const { startDate, endDate } = await this.getDateRange(fromDate, toDate);
      const filter = {
        active: true,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };

      const result = await this.orderRepository.getTopSellingCategory(filter);
      if (!result) {
        return {
          success: false,
          message: "Failed to get order product wise report",
        };
      }
      return {
        success: true,
        message: "Successfully retrieved order product wise report",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error while getting order product wise report",
      };
    }
  }

  async getOverAllReport(fromDate, toDate) {
    try {
      // usage
      const { startDate, endDate } = await this.getDateRange(fromDate, toDate);

      const result = await this.orderRepository.getOverAllReport(
        startDate,
        endDate
      );
      if (!result) {
        return {
          success: false,
          message: "Failed to get order product wise report",
        };
      }
      return {
        success: true,
        message: "Successfully retrieved order product wise report",
        data: result[0],
      };
    } catch (error) {
      return {
        success: false,
        message: "Error while getting order product wise report",
      };
    }
  }

  async getOrderStatusList() {
    try {
      const result = await this.orderRepository.findOrderStatus();
      if (result) {
        return {
          success: true,
          data: result,
        };
      }
      return {
        success: false,
        message: "Failed to get order status",
      };
    } catch (error) {
      return { success: false, message: "Error while getting order Status" };
    }
  }

  async changeOrderStatus(statusId, orderId, remarks, orderStatusData) {
    try {
      const orderData = await this.orderRepository.findById({ _id: orderId });
      const statusData = await this.orderRepository.findStatusById(statusId);

      if (statusData?.statusNo == "2") {
        if (!orderData?.cartId) {
          return {
            success: false,
            message: "Cart ID not found in order data",
          };
        }

        const orderItems = await this.orderRepository.findOrderItemsByCartId(
          orderId
        );

        if (!orderItems || orderItems.length === 0) {
          return {
            success: false,
            message: "No cart items found",
          };
        }

        for (const item of orderItems) {
          if (item.productId && item.sizeId) {
            const reductionResult =
              await this.productRepository.reduceProductQuantity(
                item.productId,
                item.sizeId,
                item.quantity || 1
              );

            if (!reductionResult.success) {
              console.error(
                `Failed to reduce quantity for product ${item.productId}, size ${item.sizeId}:`,
                reductionResult.message
              );
            }
          }
        }
      }

      const result = await this.orderRepository.changeOrderStatus(
        statusId,
        orderId,
        orderStatusData
      );

      if (result) {
        let title = "Order Status";
        let message = "";

        if (statusData?.statusNo == "2") {
          message = `Your order has been placed successfully! Order ID: ${orderData?.orderId}`;
        } else if (statusData?.statusNo == "3") {
          message = `Your order has been delivered successfully. Order ID: ${orderData?.orderId}`;
        } else if (statusData?.statusNo == "4") {
          message = `Your order has been cancelled. Order ID: ${orderData?.orderId}`;
        }

        await this.sendNotification(orderData?.userId, title, message);
        return {
          success: true,
          data: result,
        };
      }

      return {
        success: false,
        message: "Failed to update order status",
      };
    } catch (error) {
      console.error("Error while updating order status:", error);
      return {
        success: false,
        message: "Error while updating order status",
      };
    }
  }

  async getPaymentReport(page, limit, search, from_date, to_date, paymentMode) {
    page = page || 1;
    limit = limit || 10;
    let filter = {};

    try {
      if (from_date && to_date) {
        if (new Date(to_date) < new Date(from_date)) {
          throw new Error("End date cannot be before start date");
        }

        const startDate = moment
          .tz(from_date, "Asia/Kolkata")
          .startOf("day")
          .toDate();
        const endDate = moment
          .tz(to_date, "Asia/Kolkata")
          .endOf("day")
          .toDate();

        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const result = await this.orderRepository.getPaymentReport(
        page,
        limit,
        filter,
        search
      );
      if (result) {
        return {
          success: true,
          data: result,
        };
      }
      return {
        success: false,
        message: "Failed to Update order status",
      };
    } catch (error) {
      return { success: false, message: "Error while getting order Status" };
    }
  }

  async getTopSellingProducttable(
    fromDate,
    toDate,
    page,
    limit,
    search,
    id_category
  ) {
    try {
      const { startDate, endDate } = await this.getDateRange(fromDate, toDate);
      const filter = {
        active: true,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
      if (id_category) {
        filter.id_category = id_category;
      }

      const result = await this.orderRepository.getTopSellingProducttable(
        page,
        limit,
        filter,
        search
      );
      if (!result) {
        return {
          success: false,
          message: "Failed to get order product wise report",
        };
      }
      return {
        success: true,
        message: "Successfully retrieved order product wise report",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error while getting order product wise report",
      };
    }
  }
}

export default OrderUseCase;
