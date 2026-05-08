import paymentOrderModel from "../../models/chit/paymentOrderModel.js";
import paymentModel from "../../models/chit/paymentModel.js";

class PaymentOrderRepository {
  async addPaymentOrder(data) {
    try {
      const result = await paymentOrderModel.create(data);

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      const result = await paymentOrderModel.findOne(query);

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async find(query) {
    try {
      const result = await paymentOrderModel.find(query);

      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async findAndUpdate(query, update, options = {}) {
    try {
      const { returnDocument, ...restOptions } = options;

      const mongooseOptions = {
        new: returnDocument === "after" || options.new === true,
        ...restOptions,
      };

      const result = await paymentOrderModel.findOneAndUpdate(
        query,
        update,
        mongooseOptions,
      );

      return result || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findByDateRange(startDate, endDate, skip, limit) {
    try {
      const result = await paymentOrderModel
        .find({
          status: 1,
          is_deleted: false,
          createdAt: { $gte: startDate, $lte: endDate },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return result || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async countByDateRange(startDate, endDate) {
    try {
      return await paymentOrderModel.countDocuments({
        status: 1,
        is_deleted: false,
        createdAt: { $gte: startDate, $lte: endDate },
      });
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
}

export default PaymentOrderRepository;
