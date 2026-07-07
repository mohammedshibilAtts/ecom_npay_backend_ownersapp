import metalRateModel from "../../models/chit/metalRateModel.js";
import PuriytRepository from "./purityReporsitory.js";
import purityModel from "../../models/chit/purityModel.js";
import mongoose from "mongoose";

class MetalRateRepository {
  constructor() {
    this.purityRepo = new PuriytRepository();
  }

  async findById(id) {
    try {
      const savedData = await metalRateModel
        .findById(id)
        .populate({
          path: "id_branch",
          select: "branch_name _id mobile",
        })
        .lean();

      if (savedData) {
        return savedData;
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error: metal rate findbyid");
    }
  }

  async getByPurityId(id) {
    try {
      const savedData = await metalRateModel
        .findOne({ purity_id: id })
        .sort({ createdAt: -1 })
        .lean();

      return savedData || null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error: metal rate findOne by id");
    }
  }

  async updateMetalId(id, metalId) {
    try {
      const updatedData = await metalRateModel.findByIdAndUpdate(
        { _id: id },
        { $set: { material_type_id: metalId } },
        { new: true },
      );

      if (updatedData) {
        return updatedData;
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error: editMetalRate");
    }
  }

  async addMetalRate(data) {
    try {
      let savedData;

      if (Array.isArray(data)) {
        savedData = await metalRateModel.insertMany(data);
      } else {
        // If data is a single object, create and save it normally
        const metalRateInstance = new metalRateModel(data);
        savedData = await metalRateInstance.save();
      }

      if (!savedData || (Array.isArray(savedData) && savedData.length === 0)) {
        return { success: false, message: "Failed to add metal rate" };
      }

      return {
        success: true,
        message: "Metal rate added successfully",
        data: savedData,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "An error occurred while adding metal rate",
      };
    }
  }

  async editMetalRate(id, data) {
    try {
      const updatedData = await metalRateModel.findByIdAndUpdate(
        { _id: id },
        { $set: data },
        { new: true },
      );

      if (updatedData) {
        return updatedData;
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error: editMetalRate");
    }
  }
  async deleteMetalRate(id) {
    try {
      const updatedData = await metalRateModel.findByIdAndUpdate(
        { _id: id },
        { $set: { is_deleted: true, active: false } },
        { new: true },
      );

      if (updatedData) {
        return updatedData;
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error: editMetalRate");
    }
  }

  async currenPreviousMetalRate(branchId) {
    try {
      const metalRates = await metalRateModel
        .find({ id_branch: branchId, active: true })
        .sort({ updatetime: -1 })
        .limit(2)
        .lean();

      if (!metalRates) {
        return null;
      }

      return metalRates;
    } catch (error) {
      console.error(error);
      throw new Error("Database error: currentPreviousMetalRate");
    }
  }

  async metalRateTable(query, page, limit) {
    try {
      const totalCount = await metalRateModel.countDocuments(query);

      const data = await metalRateModel
        .find(query)
        .skip(page)
        .limit(limit)
        .populate([
          {
            path: "id_branch",
            select: "branch_name",
          },
          {
            path: "material_type_id",
            // select: "branch_name",
          },
          {
            path: "purity_id",
            // select: "branch_name",
          },
        ])
        .select("-created_by -modified_by -updatetime -__v")
        .sort({ _id: -1 })
        .lean();

      if (!data || data.length === 0) return null;

      return { data, totalCount };
    } catch (error) {
      console.error("Error in getAllMetals:", error);
      throw new Error("Database error occurred while fetching data");
    }
  }

  // support repo for payment to fetch current date metal rate
  async getTodayMetalRate(date) {
    try {
      const metalData = await metalRateModel
        .findOne({ createdAt: { $lte: date } })
        .sort("-createdAt")
        .limit(1)
        .lean();

      if (!metalData) {
        return null;
      }

      return metalData;
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while fetching data");
    }
  }

  async todaysMetalRateByMetal(metalId, purityId, branchId, date = null) {
    try {
      const queryDate = date ? new Date(date) : new Date();
      queryDate.setHours(23, 59, 59, 999);

      const metalRates = await metalRateModel
        .find({
          material_type_id: metalId,
          id_branch: branchId,
          purity_id: purityId,
          createdAt: { $lte: queryDate },
          active: true,
          is_deleted: false,
        })
        .sort({ createdAt: -1 })
        .limit(1);

      return metalRates.length ? metalRates[0] : null;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database error while fetching metal rate");
    }
  }

  async getMetalRate(branchId, date = null) {
    try {
      // First get all active purities
      const purityQuery = { active: true, is_deleted: false };
      const purityData = await this.purityRepo.find(purityQuery);

      if (!purityData.length) {
        return { success: false, message: "No active purities found" };
      }

      const purityIds = purityData.map((purity) => purity._id);

      const query = {
        active: true,
        is_deleted: false,
        purity_id: { $in: purityIds },
      };

      if (branchId !== "0") {
        query.id_branch = branchId;
      }

      let metalRates = await metalRateModel
        .find(query)
        .populate("material_type_id")
        .populate({
          path: "purity_id",
          match: { active: true, is_deleted: false },
        })
        .sort({ createdAt: -1 })
        .select("-created_by -modified_by -__v");

      metalRates = metalRates.filter((rate) => rate.purity_id !== null);

      const latestRates = {};
      metalRates.forEach((rate) => {
        const purityId = rate.purity_id._id.toString();
        if (
          !latestRates[purityId] ||
          new Date(rate.createdAt) > new Date(latestRates[purityId].createdAt)
        ) {
          latestRates[purityId] = rate;
        }
      });

      const result = Object.values(latestRates);

      return result.length ? result : null;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database error while fetching metal rate");
    }
  }

  async getOptimizedRate() {
    try {
      const pipeline = [
        {
          $match: {
            active: true,
            is_deleted: false,
            purity_id: { $ne: null }
          }
        },
        {
          $sort: { purity_id: 1, createdAt: -1 }
        },
        {
          $group: {
            _id: "$purity_id",
            rate: { $first: "$rate" },
            material_type_id: { $first: "$material_type_id" }
          }
        },
        {
          $lookup: {
            from: "purities",
            localField: "_id",
            foreignField: "_id",
            as: "purity"
          }
        },
        { $unwind: { path: "$purity", preserveNullAndEmptyArrays: false } },
        {
          $match: {
            "purity.active": true,
            "purity.is_deleted": false
          }
        },
        {
          $lookup: {
            from: "metals",
            localField: "material_type_id",
            foreignField: "_id",
            as: "metal"
          }
        },
        { $unwind: { path: "$metal", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            metal_name: { $ifNull: ["$metal.metal_name", "Unknown"] },
            purity: "$purity.purity_name",
            rate: 1
          }
        }
      ];

      const result = await metalRateModel.aggregate(pipeline);

      return result.length ? result : null;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database error while fetching optimized metal rate");
    }
  }

  async getIds(branchId, date = null, ids, metalId) {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return { success: false, message: "No purity IDs provided" };
      }

      const purityIds = ids.map((id) => new mongoose.Types.ObjectId(id));
      const metalObjectId = new mongoose.Types.ObjectId(metalId);

      const query = {
        active: true,
        is_deleted: false,
        purity_id: { $in: purityIds },
      };

      if (branchId !== "0") {
        query.id_branch = new mongoose.Types.ObjectId(branchId);
      }

      const metalRateDocs = await metalRateModel.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$purity_id",
            latestDoc: { $first: "$$ROOT" },
          },
        },
        { $replaceRoot: { newRoot: "$latestDoc" } },
      ]);

      const resultIds = metalRateDocs.map((doc) => doc._id);

      if (resultIds.length > 0) {
        await metalRateModel.updateMany(
          { _id: { $in: resultIds } },
          { $set: { material_type_id: metalObjectId } },
        );
      }

      return resultIds.length ? resultIds : null;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database error while fetching/updating metal rate IDs");
    }
  }

  async addInitialRate(data) {
    try {
      const metalData = await metalRateModel.create(data);

      if (!metalData) {
        return null;
      }

      return metalData;
    } catch (error) {
      console.error(error);
      throw new Error("Database error occurred while fetching data");
    }
  }

  async getMetalRateHistoryCursor({
    branchId,
    metalId,
    purityId,
    fromDate,
    toDate,
    limit = 10,
    cursor = null,
    sortBy = "created_date",
    sortOrder = "desc",
  }) {
    try {
      const matchStage = {
        active: true,
        is_deleted: false,
      };

      if (branchId) {
        matchStage.id_branch = new mongoose.Types.ObjectId(branchId);
      }
      if (metalId) {
        matchStage.material_type_id = new mongoose.Types.ObjectId(metalId);
      }
      if (purityId) {
        matchStage.purity_id = new mongoose.Types.ObjectId(purityId);
      }

      if (fromDate || toDate) {
        matchStage.createdAt = {};
        if (fromDate) {
          const start = new Date(fromDate);
          start.setHours(0, 0, 0, 0);
          matchStage.createdAt.$gte = start;
        }
        if (toDate) {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          matchStage.createdAt.$lte = end;
        }
      }

      // Sorting Logic
      let sortField = "createdAt";
      if (sortBy === "rate") sortField = "rate";
      else if (sortBy === "created_by") sortField = "created_by";

      const sortDir = sortOrder === "asc" ? 1 : -1;
      const isDefaultSort =
        (sortBy === "created_date" || sortBy === "createdAt") &&
        sortOrder === "desc";

      if (cursor) {
        if (isDefaultSort) {
          matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) };
        } else {
          try {
            const decoded = Buffer.from(cursor, "base64").toString("utf-8");
            const [cursorValStr, cursorId] = decoded.split("_");

            if (cursorValStr && cursorId) {
              let cursorVal = cursorValStr;
              if (sortField === "rate") cursorVal = Number(cursorVal);
              else if (sortField === "createdAt")
                cursorVal = new Date(cursorVal);

              const operator = sortDir === 1 ? "$gt" : "$lt";

              matchStage.$or = [
                { [sortField]: { [operator]: cursorVal } },
                {
                  [sortField]: cursorVal,
                  _id: { [operator]: new mongoose.Types.ObjectId(cursorId) },
                },
              ];
            }
          } catch (e) {
            console.error("Invalid cursor format", e);
          }
        }
      }

      // Build aggregation pipeline
      const aggregationPipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "metals",
            localField: "metal_id",
            foreignField: "_id",
            as: "metal_id",
          },
        },
        {
          $unwind: {
            path: "$metal_id",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "purities",
            localField: "purity_id",
            foreignField: "_id",
            as: "purity_id",
          },
        },
        { $unwind: { path: "$purity_id", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            purity_name: "$purity_id.purity_name",
            metal_name: "$metal_id.metal_name",
            purity_group: {
              $switch: {
                branches: [
                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(24[\\s\\-]?k(t)?|24[\\s\\-]?ct|24[\\s\\-]?karat|^24$|kt$|^ct$)",
                      },
                    },
                    then: 1,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(22[\\s\\-]?k(t)?|22[\\s\\-]?ct|22[\\s\\-]?karat)",
                      },
                    },
                    then: 2,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(18[\\s\\-]?k(t)?|18[\\s\\-]?ct|18[\\s\\-]?karat)",
                      },
                    },
                    then: 3,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(999(\\.\\d+)?|[\\s\\-]?999[\\s\\-]?silver|pure[\\s\\-]?silver|fine[\\s\\-]?silver)",
                      },
                    },
                    then: 4,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(925(\\.\\d+)?|[\\s\\-]?925[\\s\\-]?silver|sterling[\\s\\-]?silver|92[\\s\\-]?5)",
                      },
                    },
                    then: 5,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(14[\\s\\-]?k(t)?|14[\\s\\-]?ct|14[\\s\\-]?karat)",
                      },
                    },
                    then: 6,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(10[\\s\\-]?k(t)?|10[\\s\\-]?ct|10[\\s\\-]?karat)",
                      },
                    },
                    then: 7,
                  },

                  {
                    case: {
                      $regexMatch: {
                        input: {
                          $toLower: {
                            $trim: { input: "$purity_id.purity_name" },
                          },
                        },
                        regex:
                          "^(20[\\s\\-]?k(t)?|9[\\s\\-]?k(t)?|916|22kt|18kt|14kt|10kt|750|585|375|417)",
                      },
                    },
                    then: 8,
                  },

                  {
                    case: {
                      $and: [
                        {
                          $not: {
                            $regexMatch: {
                              input: {
                                $toLower: {
                                  $trim: { input: "$purity_id.purity_name" },
                                },
                              },
                              regex: "^(999|925|sterling|pure|fine)",
                            },
                          },
                        },
                        {
                          $regexMatch: {
                            input: {
                              $toLower: {
                                $trim: { input: "$purity_id.purity_name" },
                              },
                            },
                            regex: "(silver|ag|argentum)",
                          },
                        },
                      ],
                    },
                    then: 9,
                  },

                  {
                    case: {
                      $and: [
                        {
                          $not: {
                            $regexMatch: {
                              input: {
                                $toLower: {
                                  $trim: { input: "$purity_id.purity_name" },
                                },
                              },
                              regex:
                                "^(24|22|18|14|10|20|9|916|750|585|375|417)",
                            },
                          },
                        },
                        {
                          $regexMatch: {
                            input: {
                              $toLower: {
                                $trim: { input: "$purity_id.purity_name" },
                              },
                            },
                            regex: "(gold|au|aurum|yellow[\\s\\-]?gold)",
                          },
                        },
                      ],
                    },
                    then: 10,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $project: {
            modified_by: 0,
            __v: 0,
            active: 0,
            is_deleted: 0,
            id_branch: 0,
            "material_type_id.__v": 0,
            "material_type_id.active": 0,
            "purity_id.__v": 0,
            "purity_id.active": 0,
            ...(sortField !== "created_by" && { created_by: 0 }),
            "purity_id.purity_name": 0,
          },
        },
      ];
      aggregationPipeline.push({ $sort: { _id: -1 } });

      aggregationPipeline.push({
        $group: {
          _id: { $ifNull: ["$group_id", "$_id"] },
          group_id: { $first: "$group_id" },
          createdAt: { $first: "$createdAt" },
          rates: { $push: "$$ROOT" },
        },
      });

      if (isDefaultSort) {
        aggregationPipeline.push({ $sort: { _id: -1 } });
      } else {
        aggregationPipeline.push({
          $sort: { [sortField]: sortDir, _id: sortDir },
        });
      }

      aggregationPipeline.push({ $limit: limit });

      const data = await metalRateModel.aggregate(aggregationPipeline);

      // Get total count (groups)
      const countMatchStage = { ...matchStage };
      delete countMatchStage._id;
      delete countMatchStage.$or;

      const countResult = await metalRateModel.aggregate([
        { $match: countMatchStage },
        {
          $group: {
            _id: { $ifNull: ["$group_id", "$_id"] },
          },
        },
        { $count: "total" },
      ]);

      const totalCount = countResult.length > 0 ? countResult[0].total : 0;

      let nextCursor = null;
      if (data.length > 0) {
        const lastItem = data[data.length - 1];
        if (isDefaultSort) {
          nextCursor = lastItem._id;
        } else {
          let val = lastItem[sortField];
          if (val instanceof Date) val = val.toISOString();
          nextCursor = Buffer.from(`${val}_${lastItem._id}`).toString("base64");
        }
      }

      return {
        data,
        totalCount,
        nextCursor,
      };
    } catch (error) {
      console.error("Error in getMetalRateHistoryCursor:", error);
      throw new Error("Database error occurred while fetching history");
    }
  }
}

export default MetalRateRepository;
