import metalRateModel from "../../models/chit/metalRateModel.js";
import mongoose from "mongoose";

class MetalRateRepo {
    async getMetalRate(branchId, date = null) {
        try {
            const matchQuery = {
                active: true,
                is_deleted: false
            };

            if (branchId && branchId !== "0") {
                matchQuery.id_branch = new mongoose.Types.ObjectId(branchId);
            }

            if (date) {
                const queryDate = new Date(date);
                queryDate.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $lte: queryDate };
            }

            const pipeline = [
                { $match: matchQuery },

                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: "$purity_id",
                        latestRate: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$latestRate" } },
                {
                    $lookup: {
                        from: "purities",
                        localField: "purity_id",
                        foreignField: "_id",
                        as: "purity_info"
                    }
                },
                { $unwind: "$purity_info" },
                {
                    $match: {
                        "purity_info.active": true,
                        "purity_info.is_deleted": false
                    }
                },
                {
                    $lookup: {
                        from: "metals",
                        localField: "material_type_id",
                        foreignField: "_id",
                        as: "metal_info"
                    }
                },
                { $unwind: { path: "$metal_info", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        purity_id: "$purity_id",
                        material_type_id: "$material_type_id",
                        rate: "$rate",
                        id_branch: "$id_branch",
                        metal_name: "$metal_info.metal_name",
                        purity_name: "$purity_info.purity_name",
                        active: "$metal_info.active",
                        createdAt: "$createdAt"
                    }
                }
            ];

            const result = await metalRateModel.aggregate(pipeline);

            return result.length ? result : null;
        } catch (error) {
            console.error("Database error:", error);
            throw new Error("Database error while fetching metal rate");
        }
    }
}

export default MetalRateRepo;
