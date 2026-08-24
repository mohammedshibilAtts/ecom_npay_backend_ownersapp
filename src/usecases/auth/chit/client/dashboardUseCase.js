import mongoose, { isValidObjectId } from "mongoose";
import axios from "axios";
import config from "../../../../config/chit/env.js";
import SchemeAccountRepository from "../../../../infrastructure/repositories/chit/schemeAccountRepository.js";
import cacheService from "../../../../utils/cacheService.js";
import crypto from "crypto";
import moment from "moment-timezone";
const generateCacheKey = (prefix, branchId, params) => {
  const hash = crypto.createHash('md5').update(JSON.stringify(params || {})).digest('hex');
  return `dashboard:${branchId || "all"}:${prefix}:${hash}`;
};

const getISTToday = () => {
  const utcDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(utcDate.getTime() + istOffset);
};

class DashboardUseCase {
  constructor(branchRepository, dashboardRepository) {
    this.branchRepository = branchRepository;
    this.dashboardRepository = dashboardRepository;
    this.schemeaccRepo = new SchemeAccountRepository();
  }

  async getAllOver(data) {
    try {
      const { branchId } = data;
      const cacheKey = generateCacheKey("overall", branchId, data);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const filter = { is_deleted: false, active: true };
      if (branchId) {
        if (isValidObjectId(branchId)) {
          const isValidBranch = await this.branchRepository.findById(branchId);
          if (!isValidBranch) {
            return { success: false, message: "Branch not found" };
          }
          filter.id_branch = new mongoose.Types.ObjectId(branchId);
        } else {
          return { success: false, message: "Provide Valid Branch ID" };
        }
      }

      const overAllData = await this.dashboardRepository.getAllOver(filter);

      if (overAllData) {
        const overDueData = await this.dashboardRepository.overdueCalculation();
        overAllData.overDues = overDueData.totalOverdueAccounts;

        const response = {
          success: true,
          data: overAllData,
          message: "Dashboard Data fetched successfully",
        };
        cacheService.set(cacheKey, response);
        return response;
      }

      return { success: false, message: "Failed to fetch data" };
    } catch (err) {
      return { success: false, message: "Failed to get allover data" };
    }
  }

  async accountStat(params) {
    try {
      const { id_branch, startDate, endDate, idScheme } = params;
      const cacheKey = generateCacheKey("accountreview", id_branch, params);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) return cachedData;

      const filter = { is_deleted: false, active: true };

      if (id_branch) {
        if (isValidObjectId(id_branch)) {
          const isValidBranch = await this.branchRepository.findById(id_branch);
          if (!isValidBranch) {
            return { success: false, message: "Branch not found" };
          }
          filter.id_branch = new mongoose.Types.ObjectId(id_branch);
        } else {
          return { success: false, message: "Provide a valid Branch ID" };
        }
      }

      if (idScheme) {
        if (isValidObjectId(idScheme)) {
          filter.id_scheme = new mongoose.Types.ObjectId(idScheme);
        } else {
          return { success: false, message: "Provide a valid Scheme ID" };
        }
      }

      if (startDate && endDate) {
        if (new Date(endDate) < new Date(startDate)) {
          return { success: false, message: "End date cannot be before start date" };
        }
        const parsedStartDate = moment.tz(startDate, "Asia/Kolkata").startOf("day").toDate();
        const parsedEndDate = moment.tz(endDate, "Asia/Kolkata").endOf("day").toDate();

        filter.createdAt = {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        };
      }

      const data = await this.dashboardRepository.getAccountStat(filter);

      if (data) {
        const response = {
          success: true,
          data,
          message: "Account Data fetched successfully",
        };
        cacheService.set(cacheKey, response);
        return response;
      }

      return { success: false, message: "Failed to fetch data" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to get overall data" };
    }
  }

  async account(params) {
    try {
      const { id_branch, startDate, endDate, idScheme } = params;
      const cacheKey = generateCacheKey("account", id_branch, params);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) return cachedData;

      const filter = { is_deleted: false, active: true };

      if (id_branch) {
        if (isValidObjectId(id_branch)) {
          const isValidBranch = await this.branchRepository.findById(id_branch);
          if (!isValidBranch) {
            return { success: false, message: "Branch not found" };
          }
          filter.id_branch = new mongoose.Types.ObjectId(id_branch);
        } else {
          return { success: false, message: "Provide a valid Branch ID" };
        }
      }

      if (idScheme) {
        if (isValidObjectId(idScheme)) {
          filter.id_scheme = new mongoose.Types.ObjectId(idScheme);
        } else {
          return { success: false, message: "Provide a valid Scheme ID" };
        }
      }

      if (startDate && endDate) {
        if (new Date(endDate) < new Date(startDate)) {
          return { success: false, message: "End date cannot be before start date" };
        }
        const parsedStartDate = moment.tz(startDate, "Asia/Kolkata").startOf("day").toDate();
        const parsedEndDate = moment.tz(endDate, "Asia/Kolkata").endOf("day").toDate();

        filter.createdAt = {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        };
      }

      const data = await this.dashboardRepository.getAccountData(filter);

      if (data) {
        const response = {
          success: true,
          data,
          message: "Account Data fetched successfully",
        };
        cacheService.set(cacheKey, response);
        return response;
      }

      return { success: false, message: "Failed to fetch data" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to get overall data" };
    }
  }

  async getPaymentHistory(params) {
    try {
      const { page, limit, id_branch, idScheme, fromDate, toDate, search } = params;
      const cacheKey = generateCacheKey("paymenthistory", id_branch, params);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) return cachedData;

      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const skip = (pageNum - 1) * pageSize;
      const filter = {};

      if (id_branch) {
        if (isValidObjectId(id_branch)) {
          const isValidBranch = await this.branchRepository.findById(id_branch);
          if (!isValidBranch) {
            return { success: false, message: "Branch not found" };
          }
          filter.id_branch = new mongoose.Types.ObjectId(id_branch);
        } else {
          return { success: false, message: "Provide a valid Branch ID" };
        }
      }

      if (idScheme) {
        if (isValidObjectId(idScheme)) {
          filter.id_scheme = new mongoose.Types.ObjectId(idScheme);
        } else {
          return { success: false, message: "Provide a valid Scheme ID" };
        }
      }

      if (fromDate && toDate) {
        if (new Date(toDate) < new Date(fromDate)) {
          return { success: false, message: "End date cannot be before start date" };
        }
        const parsedStartDate = moment.tz(fromDate, "Asia/Kolkata").startOf("day").toDate();
        const parsedEndDate = moment.tz(toDate, "Asia/Kolkata").endOf("day").toDate();

        filter.createdAt = {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        };
      }

      const data = await this.dashboardRepository.getPaymentHistory(
        skip,
        pageSize,
        filter,
        search,
      );

      if (data) {
        const response = {
          success: true,
          data,
          message: "Payment History Data fetched successfully",
        };
        cacheService.set(cacheKey, response);
        return response;
      }

      return { success: false, message: "Failed to fetch data" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to get overall data" };
    }
  }

  // async getMonthlyInsights(params) {
  //   try {
  //     const { id_branch, idScheme, year, month } = params;
  //     const cacheKey = generateCacheKey("monthlyinsights", id_branch, params);
  //     const cachedData = cacheService.get(cacheKey);
  //     if (cachedData) return cachedData;

  //     const filter = { is_deleted: false };

  //     if (id_branch) {
  //       if (isValidObjectId(id_branch)) {
  //         const isValidBranch = await this.branchRepository.findById(id_branch);
  //         if (!isValidBranch) {
  //           return { success: false, message: "Branch not found" };
  //         }
  //         filter.id_branch = new mongoose.Types.ObjectId(id_branch);
  //       } else {
  //         return { success: false, message: "Provide a valid Branch ID" };
  //       }
  //     }

  //     if (idScheme) {
  //       if (isValidObjectId(idScheme)) {
  //         filter.id_scheme = new mongoose.Types.ObjectId(idScheme);
  //       } else {
  //         return { success: false, message: "Provide a valid Scheme ID" };
  //       }
  //     }

  //     const isYearly = year === true || year === "true";
  //     const isMonthly = month === true || month === "true" || !isYearly; // Default to monthly if neither is true

  //     const data = await this.dashboardRepository.getInsightsData(
  //       filter,
  //       isYearly,
  //       isMonthly,
  //     );
  //     if (data) {
  //       const response = {
  //         success: true,
  //         data,
  //         message: "Insights fetched successfully",
  //       };
  //       cacheService.set(cacheKey, response);
  //       return response;
  //     }

  //     return { success: false, message: "Failed to fetch data" };
  //   } catch (err) {
  //     console.error(err);
  //     return { success: false, message: "Failed to get Insights data" };
  //   }
  // }
  async getMonthlyInsights({ id_branch, idScheme, year, month }) {
    try {
      const filter = { is_deleted: false };

      if (id_branch) {
        if (isValidObjectId(id_branch)) {
          const isValidBranch = await this.branchRepository.findById(id_branch);
          if (!isValidBranch) {
            return { success: false, message: "Branch not found" };
          }
          filter.id_branch = new mongoose.Types.ObjectId(id_branch);
        } else {
          return { success: false, message: "Provide a valid Branch ID" };
        }
      }

      if (idScheme) {
        if (isValidObjectId(idScheme)) {
          filter.id_scheme = new mongoose.Types.ObjectId(idScheme);
        } else {
          return { success: false, message: "Provide a valid Scheme ID" };
        }
      }

      const isYearly = year === true || year === "true";
      const isMonthly = month === true || month === "true" || !isYearly; // Default to monthly if neither is true

      const data = await this.dashboardRepository.getInsightsData(
        filter,
        isYearly,
        isMonthly,
      );
      if (data) {
        return {
          success: true,
          data,
          message: "Insights fetched successfully",
        };
      }

      return { success: false, message: "Failed to fetch data" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to get Insights data" };
    }
  }

  async paymentModeData(params) {
    try {
      const { id_branch, fromDate, toDate, page, limit } = params;
      const cacheKey = generateCacheKey("paymentmodehistory", id_branch, params);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) return cachedData;

      const filter = { is_deleted: false };

      if (id_branch) {
        if (isValidObjectId(id_branch)) {
          const isValidBranch = await this.branchRepository.findById(id_branch);
          if (!isValidBranch) {
            return { success: false, message: "Branch not found" };
          }
          filter.id_branch = new mongoose.Types.ObjectId(id_branch);
        } else {
          return { success: false, message: "Provide a valid Branch ID" };
        }
      }

      const istToday = getISTToday();
      const startOfToday = new Date(istToday.getUTCFullYear(), istToday.getUTCMonth(), istToday.getUTCDate(), 0, 0, 0, 0);
      const endOfToday = new Date(istToday.getUTCFullYear(), istToday.getUTCMonth(), istToday.getUTCDate(), 23, 59, 59, 999);

      if (fromDate && toDate) {
        if (new Date(toDate) < new Date(fromDate)) {
          return { success: false, message: "End date cannot be before start date" };
        }
        const parsedStartDate = moment.tz(fromDate, "Asia/Kolkata").startOf("day").toDate();
        const parsedEndDate = moment.tz(toDate, "Asia/Kolkata").endOf("day").toDate();

        filter.createdAt = {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        };
      } else {
        const startOfToday = moment.tz("Asia/Kolkata").startOf("day").toDate();
        const endOfToday = moment.tz("Asia/Kolkata").endOf("day").toDate();
        filter.createdAt = {
          $gte: startOfToday,
          $lte: endOfToday,
        };
      }

      if (page) filter.page = page;
      if (limit) filter.limit = limit;

      const data = await this.dashboardRepository.paymentModeData(filter);
      if (data) {
        const response = {
          success: true,
          data: data.data,
          total: data.total,
          message: "Payment Mode Data fetched successfully",
        };
        cacheService.set(cacheKey, response);
        return response;
      }

      return { success: false, message: "Failed to fetch data" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to get Payment Mode data" };
    }
  }

  async getSettlements(params) {
    try {
      const id_branch = params?.id_branch || params?.branchId || "all";
      const cacheKey = generateCacheKey("settlements", id_branch, params);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) return cachedData;

      const limit = params?.pagination?.limit || params?.limit || 10;
      const cursor = params?.pagination?.cursor || params?.cursor;
      const startDate = params?.filters?.start_date || params?.startDate;
      const endDate = params?.filters?.end_date || params?.endDate;

      const pageSize = parseInt(limit);

      let parsedStartDate, parsedEndDate;

      if (startDate && endDate) {
        parsedStartDate = new Date(startDate);
        parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate)) {
          return { success: false, message: "Invalid start date format." };
        }

        if (isNaN(parsedEndDate)) {
          return { success: false, message: "Invalid end date format." };
        }
      } else {
        const istToday = getISTToday();
        parsedStartDate = new Date(istToday.getUTCFullYear(), istToday.getUTCMonth(), istToday.getUTCDate(), 0, 0, 0, 0);
        parsedEndDate = new Date(istToday.getUTCFullYear(), istToday.getUTCMonth(), istToday.getUTCDate(), 23, 59, 59, 999);
      }

      // Convert date to YYYY-MM-DD string, then append exact IST time string
      const toISTISOString = (date, endOfDay = false) => {
        const d = new Date(date);

        // Extract local year, month, day to avoid UTC shift issues
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        const dateStr = `${year}-${month}-${day}`;

        if (endOfDay) {
          return `${dateStr}T23:59:59+05:30`;
        } else {
          return `${dateStr}T00:00:00+05:30`;
        }
      };

      const search = params?.filters?.search || params?.search || "";
      const searchTerm = search.trim().toLowerCase();

      const fetchPage = async (cur) => {
        const body = {
          pagination: { limit: 100, ...(cur ? { cursor: cur } : {}) },
          filters: {
            start_date: toISTISOString(parsedStartDate),
            end_date: toISTISOString(parsedEndDate, true),
          },
        };
        const res = await axios.post(
          "https://api.cashfree.com/pg/settlement/recon",
          body,
          {
            headers: {
              "x-client-id": config.CASHFREE_CLIENT_ID,
              "x-client-secret": config.CASHFREE_SECRET,
              "x-api-version": "2022-09-01",
              "Content-Type": "application/json",
            },
          },
        );
        return res.data || {};
      };

      const mapItem = (item) => ({
        initiated_at: item.settlement_initiated_on || item.event_time,
        transaction_period:
          item.payment_from && item.payment_till
            ? `${item.payment_from} – ${item.payment_till}`
            : null,
        utr: item.settlement_utr || null,
        settled_amount:
          item.amount_settled ?? item.event_settlement_amount ?? 0,
        status: item.settlement_utr ? "Processed" : "Pending",
        cf_settlement_id: item.cf_settlement_id || null,
        event_type: item.event_type || null,
      });

      let settlements, nextCursor;

      if (searchTerm) {
        let allRecords = [];
        let cur = null;
        let hasMore = true;
        while (hasMore) {
          const raw = await fetchPage(cur);
          allRecords = [...allRecords, ...(raw.data || [])];
          if (raw.cursor && (raw.data || []).length > 0) {
            cur = raw.cursor;
          } else {
            hasMore = false;
          }
        }
        const filtered = allRecords.filter((item) => {
          const s = searchTerm;
          return (
            (item.settlement_utr || "").toLowerCase().includes(s) ||
            (item.payment_utr || "").toLowerCase().includes(s) ||
            String(item.cf_settlement_id || "").includes(s) ||
            (item.order_id || "").toLowerCase().includes(s) ||
            (item.customer_name || "").toLowerCase().includes(s)
          );
        });
        settlements = filtered.map(mapItem);
        nextCursor = null;
      } else {
        const raw = await fetchPage(cursor);
        settlements = (raw.data || []).map(mapItem);
        nextCursor = raw.cursor || null;
      }

      const response = {
        success: true,
        message: "Settlements fetched successfully",
        data: {
          settlements,
          nextCursor,
          limit: pageSize,
        },
      };

      // Set TTL to 5 minutes (300,000 ms) for external data
      cacheService.set(cacheKey, response, 300000);
      return response;
    } catch (err) {
      console.error(
        "Cashfree settlements error:",
        err?.response?.data || err.message,
      );

      return {
        success: false,
        message: "Failed to get settlements data",
      };
    }
  }

  async getRefunds(params) {
    try {
      const id_branch = params?.id_branch || params?.branchId || "all";
      const cacheKey = generateCacheKey("refunds", id_branch, params);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) return cachedData;

      const pageNum = params?.page ? parseInt(params.page) : 1;
      const limit = params?.pagination?.limit || params?.limit || 10;
      const startDate = params?.filters?.start_date || params?.startDate;
      const endDate = params?.filters?.end_date || params?.endDate;

      const pageSize = parseInt(limit);
      const skip = (pageNum - 1) * pageSize;

      let parsedStartDate, parsedEndDate;

      if (startDate && endDate) {
        parsedStartDate = new Date(startDate);
        parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate)) {
          return { success: false, message: "Invalid start date format." };
        }
        if (isNaN(parsedEndDate)) {
          return { success: false, message: "Invalid end date format." };
        }
      } else {
        const istToday = getISTToday();
        parsedStartDate = new Date(istToday.getUTCFullYear(), istToday.getUTCMonth(), istToday.getUTCDate(), 0, 0, 0, 0);
        parsedEndDate = new Date(istToday.getUTCFullYear(), istToday.getUTCMonth(), istToday.getUTCDate(), 23, 59, 59, 999);
      }

      // Cashfree max date range is 30 days
      const diffTime = Math.abs(parsedEndDate - parsedStartDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        return {
          success: false,
          message:
            "Date range too large. Cashfree allows maximum 30 days window.",
        };
      }

      // Convert date to YYYY-MM-DD string, then append exact IST time string
      const toISTISOString = (date, endOfDay = false) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        if (endOfDay) {
          return `${dateStr}T23:59:59+05:30`;
        } else {
          return `${dateStr}T00:00:00+05:30`;
        }
      };

      let allRecords = [];
      let currentCursor = null;
      let hasMore = true;

      // Loop to fetch ALL records from Cashfree for the date range (Max 30 days)
      while (hasMore) {
        const requestBody = {
          pagination: {
            limit: 100, // Max limit per Cashfree API
            ...(currentCursor ? { cursor: currentCursor } : {}),
          },
          filters: {
            start_date: toISTISOString(parsedStartDate),
            end_date: toISTISOString(parsedEndDate, true),
          },
        };

        const response = await axios.post(
          "https://api.cashfree.com/pg/settlement/recon",
          requestBody,
          {
            headers: {
              "x-client-id": config.CASHFREE_CLIENT_ID,
              "x-client-secret": config.CASHFREE_SECRET,
              "x-api-version": "2022-09-01",
              "Content-Type": "application/json",
            },
          },
        );

        const raw = response.data || {};
        const data = raw.data || [];
        allRecords = [...allRecords, ...data];

        if (raw.cursor && data.length > 0) {
          currentCursor = raw.cursor;
        } else {
          hasMore = false;
        }
      }

      // 1. Filter for refund events locally
      const refunds = allRecords.filter(
        (item) =>
          item.event_type === "REFUND" ||
          item.sale_type === "DEBIT" ||
          item.entity === "refund",
      );

      // 2. Paginate locally
      const total = refunds.length;
      const paginatedRefunds = refunds.slice(skip, skip + pageSize);

      // 3. Map to consistent structure
      const items = paginatedRefunds.map((item) => ({
        initiated_at: item.settlement_initiated_on || item.event_time,
        transaction_period:
          item.payment_from && item.payment_till
            ? `${item.payment_from} – ${item.payment_till}`
            : null,
        utr: item.settlement_utr || item.payment_utr || null,
        settled_amount:
          item.amount_settled ??
          item.event_settlement_amount ??
          item.event_amount ??
          0,
        status:
          item.event_status || (item.settlement_utr ? "Processed" : "Pending"),
        cf_settlement_id: item.cf_settlement_id || null,
        event_type: item.event_type || null,
      }));

      const response = {
        success: true,
        message: "Refunds fetched successfully",
        data: {
          refunds: items,
          total,
          page: pageNum,
          limit: pageSize,
        },
      };

      // Set TTL to 5 minutes (300,000 ms) for external data
      cacheService.set(cacheKey, response, 300000);
      return response;
    } catch (err) {
      console.error(
        "Cashfree refunds error:",
        err?.response?.data || err.message,
      );

      return {
        success: false,
        message: "Failed to get refunds data",
      };
    }
  }

  async getBulkStats(data) {
    try {
      const { requests } = data;
      if (!requests || !Array.isArray(requests)) {
        return { success: false, message: "Invalid requests format" };
      }

      const results = {};
      const promises = requests.map(async (req) => {
        const { type, params } = req;
        let result;
        switch (type) {
          case "overall":
            result = await this.getAllOver(params || {});
            break;
          case "accountreview":
            result = await this.accountStat(params || {});
            break;
          case "account":
            result = await this.account(params || {});
            break;
          case "paymenthistory":
            result = await this.getPaymentHistory(params || {});
            break;
          case "monthly-insights":
            result = await this.getMonthlyInsights(params || {});
            break;
          case "paymentmodehistory":
            result = await this.paymentModeData(params || {});
            break;
          case "settlements":
            result = await this.getSettlements(params || {});
            break;
          case "refunds":
            result = await this.getRefunds(params || {});
            break;
          default:
            result = { success: false, message: "Unknown request type" };
        }
        results[type] = result;
      });

      await Promise.all(promises);

      return {
        success: true,
        data: results,
        message: "Bulk dashboard stats fetched successfully",
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to get bulk dashboard data" };
    }
  }
}

export default DashboardUseCase;
