import { isValidObjectId } from "mongoose";

import PushNotificationRepository from "../../../../infrastructure/repositories/chit/pushNotificationRepository.js";
import S3Service from "../../../../utils/s3Bucket.js";
import S3Repo from "../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";
import CustomersRepository from "../../../../infrastructure/repositories/chit/CustomerRepository.js";
import TargetAudienceRepository from "../../../../infrastructure/repositories/chit/targetAudienceRepository.js";
import NotificationPromotionHistoryRepository from "../../../../infrastructure/repositories/chit/notifyPromotionHistory.js";
import smsService from "../../../../config/chit/smsService.js";
import TopupRepository from "../../../../infrastructure/repositories/chit/topupRepository.js";
import SmsSettingRepository from '../../../../infrastructure/repositories/chit/super/smsSettingRepository.js'
import config from "../../../../config/chit/env.js";
import isNotificationEnabled from "../../../../utils/notificationEnableChecket.js";

class NotifyUsecase {
  constructor() {
    this.pushNotificationRepo = new PushNotificationRepository();
    this.s3Service = new S3Service();
    this.customerRepo = new CustomersRepository();
    // this.notificationRepository = new NotificationRepository();
    this.s3Repo = new S3Repo();
    // this.s3Repo = new S3Repo();
    this.targetAudienceRepo = new TargetAudienceRepository();
    this.notifyPromotionHistoryRepo =
      new NotificationPromotionHistoryRepository();
    this.topupRepo = new TopupRepository();
    this.smsRepo = new SmsSettingRepository();
  }

  async prepareNotificationData({
    data,
    token,
    id_branch,
    id_scheme,
    new_arrival_id,
  }) {
    return {
      ...data,
      createdBy: token.id_employee,
      updatedBy: token.id_employee,
      branchId: id_branch,
      schemeId: id_scheme,
      newArraivalId: new_arrival_id,
    };
  }

  async sendPushBatchViaOneSignal(customerIds, title, body, imageUrl) {
    if (!customerIds.length) return { success: 0, failed: 0 };

    try {
      await this.sendPushNotificationAndUpdate(
        customerIds,
        title,
        body,
        imageUrl,
      );

      return {
        success: customerIds.length,
        failed: 0,
      };
    } catch (error) {
      console.error("Push batch failed:", error);

      return {
        success: 0,
        failed: customerIds.length,
      };
    }
  }

  addOneDay(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }

  async addNotification(data, files, token) {
    try {
      const {
        id_branch,
        id_scheme,
        customer_id,
        new_arrival_id,
        title,
        body,
        imageUrl,
      } = data;

      if (!id_branch || !Array.isArray(id_branch) || id_branch.length === 0) {
        return { success: false, message: "Branch ID(s) required as an array" };
      }

      let customerData = await this.getCustomerData(
        id_scheme,
        customer_id,
        id_branch,
      );

      customerData = Array.from(
        new Map(customerData.map((item) => [item._id, item])).values(),
      );

      if (!customerData.length) {
        return { success: false, message: "No customers found" };
      }

      const notificationData = await this.prepareNotificationData(
        data,
        token,
        id_branch,
        id_scheme,
        new_arrival_id,
      );
      const result =
        await this.pushNotificationRepo.addPushNotification(notificationData);

      if (!result) {
        return { success: false, message: "Push notification not saved" };
      }

      const imageUrlFinal = await this.handleImageUpload(
        files,
        imageUrl,
        token,
      );
      await this.pushNotificationRepo.updatePushNotification(result._id, {
        image: imageUrlFinal,
      });

      const customerIds = customerData.map((e) => e._id); // !only unique values
      const fcmTokens = await this.fcmTokenRepo.getByCustomerIds(customerIds);

      await this.saveTargetAudience(result._id, customerIds, fcmTokens);

      if (fcmTokens) {
        await this.sendPushNotificationAndUpdate(
          result._id,
          fcmTokens,
          title,
          body,
          imageUrlFinal,
        );
      }

      return {
        success: true,
        message: "Push notification added successfully",
        data: result,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error while adding push notification",
      };
    }
  }

  async addPromotion(data, files, token) {
    try {
      const { id_branch, title, body } = data;

      const schemeBased =
        data.schemeBased === true ||
        data.schemeBased === "true" ||
        data.schemeBased === "1";

      const selectAll =
        data.selectAll === true ||
        data.selectAll === "true" ||
        data.selectAll === "1";

      const scheduledAt = data.scheduled_at
        ? new Date(data.scheduled_at)
        : null;
      const isScheduled =
        scheduledAt &&
        !isNaN(scheduledAt.getTime()) &&
        scheduledAt > new Date();

      const id_scheme =
        schemeBased && Array.isArray(data.id_scheme) ? data.id_scheme : [];
      const customer_id =
        !selectAll && Array.isArray(data.customer_id) ? data.customer_id : [];

      if (!Array.isArray(id_branch) || id_branch.length === 0) {
        return { success: false, message: "Branch ID(s) required as an array" };
      }

      if (schemeBased && id_scheme.length === 0) {
        return {
          success: false,
          message: "Scheme ID(s) required when schemeBased is true",
        };
      }

      if (!selectAll && customer_id.length === 0) {
        return { success: false, message: "No customers selected" };
      }

      const promotionData = await this.prepareNotificationData({
        data: {
          ...data,
          schemeBased,
          selectAll,
        },
        token,
        id_branch,
        id_scheme,
      });

      const imageUrlFinal = await this.handleImageUpload(files);

      const promotion = await this.pushNotificationRepo.addPromotion({
        ...promotionData,
        noti_image: imageUrlFinal,
        status: isScheduled ? "scheduled" : "pending",
        scheduledAt: isScheduled ? scheduledAt : null,
      });

      if (!promotion) {
        return { success: false, message: "Promotion not saved" };
      }

      if (isScheduled) {
        if (!selectAll) {
          await this.pushNotificationRepo.bulkInsertPromotionCustomers(
            promotion._id,
            customer_id,
          );
        }
        return {
          success: true,
          message: `Promotion scheduled for ${scheduledAt.toISOString()}`,
          data: promotion,
        };
      }

      const notificationEnabled =
        await isNotificationEnabled("Promotioncreation");
      if (!notificationEnabled) {
        return {
          success: true,
          message: "Promotion saved (notifications disabled)",
          data: promotion,
        };
      }

      const { pushCount, pushFailCount } = await this._executePromotion({
        promotion,
        schemeBased,
        selectAll,
        id_scheme,
        customer_id,
        title,
        body,
        imageUrlFinal,
      });

      const updatedPromotion = await this.pushNotificationRepo.updatePromotion(
        promotion._id,
        { status: "sent", pushCount, pushFailCount, sentAt: new Date() },
      );

      return {
        success: true,
        message: "Promotion sent successfully",
        data: updatedPromotion,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error while adding promotion" };
    }
  }

  async _executePromotion({
    promotion,
    schemeBased,
    selectAll,
    id_scheme,
    customer_id,
    title,
    body,
    imageUrlFinal,
  }) {
    const PUSH_BATCH_SIZE = Number(process.env.PUSH_BATCH_SIZE) || 500;
    let pushCount = 0;
    let pushFailCount = 0;

    if (!selectAll) {
      // If customer_id is provided (immediate execution), insert them
      if (customer_id && customer_id.length > 0) {
        await this.pushNotificationRepo.bulkInsertPromotionCustomers(
          promotion._id,
          customer_id,
        );
      } else {
        // If not provided (cron execution), fetch from DB
        const promoCustomers = await this.pushNotificationRepo.getPromotionCustomers(promotion._id);
        customer_id = promoCustomers.map(pc => pc.customerId.toString());
      }
      
      const result = await this.sendPushBatchViaOneSignal(
        customer_id,
        title,
        body,
        imageUrlFinal,
      );
      pushCount += result.success;
      pushFailCount += result.failed;
      return { pushCount, pushFailCount };
    }

    const cursor = schemeBased
      ? this.pushNotificationRepo.getSchemeCustomerCursor(id_scheme)
      : this.pushNotificationRepo.getAllCustomerCursor();

    let batch = [];

    for await (const doc of cursor) {
      batch.push(doc._id.toString());

      if (batch.length === PUSH_BATCH_SIZE) {
        await this.pushNotificationRepo.bulkInsertPromotionCustomers(
          promotion._id,
          batch,
        );
        const result = await this.sendPushBatchViaOneSignal(
          batch,
          title,
          body,
          imageUrlFinal,
        );
        pushCount += result.success;
        pushFailCount += result.failed;
        batch = [];
      }
    }

    if (batch.length > 0) {
      await this.pushNotificationRepo.bulkInsertPromotionCustomers(
        promotion._id,
        batch,
      );
      const result = await this.sendPushBatchViaOneSignal(
        batch,
        title,
        body,
        imageUrlFinal,
      );
      pushCount += result.success;
      pushFailCount += result.failed;
    }

    return { pushCount, pushFailCount };
  }

  isValidWhatsappNumber(number) {
    return number.length >= 10;
  }

  // Helper functions
  async getCustomerData(id_scheme, customer_id, id_branch) {
    if (id_scheme && Array.isArray(id_scheme) && id_scheme.length > 0) {
      const customerIds =
        await this.customerRepo.getCustomerIdsBySchemeIds(id_scheme);

      return customerIds
        ? await this.customerRepo.getCustomersByIds(customerIds)
        : [];
    }
    if (customer_id && Array.isArray(customer_id) && customer_id.length > 0) {
      return await this.customerRepo.getCustomersByIds(customer_id);
    }
    return await this.customerRepo.getCustomersByBranch(id_branch);
  }

  async handleImageUpload(files, imageUrl, token) {
    let upload;
    let s3Settings;
    if (files && files?.[0]) {
      s3Settings = await this.s3Repo.getSetting();
      if (!s3Settings) throw new Error("S3 configuration not found");
      upload = await this.s3Service.uploadToS3(
        files[0],
        "notification",
        s3Settings,
      );
    }

    if (upload) {
      return `${s3Settings.s3display_url}${config?.AWS_LOCAL_PATH}notification/${upload}`;
    }
    return null;
  }

  async saveTargetAudience(notificationId, customerIds, fcmTokens) {
    await this.targetAudienceRepo.addTargetAudience({
      notificationId,
      promotionId: null,
      targetUsers: customerIds,
      fcmTokens,
    });
  }

  async sendPushNotificationAndUpdate(customerIds, title, body, imageUrl) {
    const input = {
      recipients: customerIds,
      title: title,
      message: body,
      channel: "push",
      imageUrl: imageUrl,
    };
    await smsService.sendNotification(input);
  }

  async getPushNotificationById(id) {
    if (!isValidObjectId(id))
      return { success: false, message: "Invalid object ID" };
    const notification =
      await this.pushNotificationRepo.getPushNotificationById(id);
    return notification
      ? {
          success: true,
          message: "Push notification fetched successfully",
          data: notification,
        }
      : { success: false, message: "Push notification not found" };
  }

  async deletePushNotification(id) {
    if (!isValidObjectId(id))
      return { success: false, message: "Invalid object ID" };
    const exists = await this.pushNotificationRepo.getPushNotificationById(id);
    if (!exists)
      return { success: false, message: "No push notification found" };

    const deleted = await this.pushNotificationRepo.deletePushNotification(id);
    return deleted
      ? { success: true, message: "Push notification deleted successfully" }
      : { success: false, message: "Failed to delete push notification" };
  }

  async pushnotificationTable({
    page = 1,
    limit = 10,
    from_date,
    to_date,
    id_branch,
    senttype,
    search,
  }) {
    try {
      const filter = { active: true };

      if (from_date && to_date) {
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);

        if (isNaN(startDate) || isNaN(endDate)) {
          return { success: false, message: "Invalid date format" };
        }

        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        filter.createdAt = { $gte: this.addOneDay(startDate), $lte: endDate };
      }

      const skip = (page - 1) * limit;
      const { data, totalCount } =
        await this.pushNotificationRepo.pushnotificationTable(
          filter,
          skip,
          parseInt(limit),
        );

      return {
        success: true,
        message: "Push notifications fetched successfully",
        data,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error while fetching push notifications",
      };
    }
  }

  async promotionTable({
    page = 1,
    limit = 10,
    from_date,
    to_date,
    id_branch,
    senttype,
    search,
  }) {
    try {
      const filter = { active: true };

      if (from_date && to_date) {
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);

        if (isNaN(startDate) || isNaN(endDate)) {
          return { success: false, message: "Invalid date format" };
        }

        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        filter.createdAt = { $gte: startDate, $lte: endDate };
      }
      if (id_branch) {
        if (!isValidObjectId(id_branch))
          return { success: false, message: "Provide a valid Branch Id" };
        filter.id_branch = new mongoose.Types.ObjectId(id_branch);
      }

      if (search) {
        const searchRegex = new RegExp(search, "i");
        filter.$or = [{ title: { $regex: searchRegex } }];
      }

      const skip = (page - 1) * limit;
      const { data, totalCount } =
        await this.pushNotificationRepo.promotionTable(
          filter,
          skip,
          parseInt(limit),
        );
      return {
        success: true,
        message: "Promotions fetched successfully",
        data,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error while fetching push notifications",
      };
    }
  }

  async getSchemeCustomers(id_scheme, page = 1, limit = 10, search = "") {
    try {
      const skip = (page - 1) * limit;

      const { data, totalDocuments } =
        await this.pushNotificationRepo.getSchemeCustomers(
          id_scheme,
          search,
          Number(skip),
          Number(limit),
        );

      return {
        success: true,
        message: "Customers fetched successfully",
        data,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error while fetching customers" };
    }
  }

  async sendpromotionnotification({ data, title, body, notificationData }) {
    if (notificationData?.push) {
      const input = {
        recipients: data.customer_id,
        title: title,
        message: body,
        channel: "push",
      };
      await smsService.sendNotification(input);

      await this.saveNotificationRepo.saveNotification({
        title: input.title,
        message: input.message,
        type: "alert",
        category: "Promotion",
      });
    }
  }

  async getCustomers(page = 1, limit = 10, search = "") {
    try {
      const skip = (page - 1) * limit;

      const { data, totalDocuments } =
        await this.pushNotificationRepo.getCustomers(
          search,
          Number(skip),
          Number(limit),
        );

      return {
        success: true,
        message: "Customers fetched successfully",
        data,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error while fetching customers" };
    }
  }
}

export default NotifyUsecase;
