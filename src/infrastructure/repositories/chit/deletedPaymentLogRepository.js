import deletedPaymentLogModel from "../../models/chit/deletedPaymentLogModel.js";

class DeletedPaymentLogRepository {
  async createLog(data) {
    try {
      const log = await deletedPaymentLogModel.create(data);
      return log;
    } catch (error) {
      console.error("Error creating deleted payment log:", error);
      return null;
    }
  }
}

export default DeletedPaymentLogRepository;
