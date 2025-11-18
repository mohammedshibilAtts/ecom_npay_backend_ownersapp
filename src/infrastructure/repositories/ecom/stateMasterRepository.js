import StateMaster from "../../models/ecom/stateMasterModel.js";

export default class StateMasterRepository {
  async create(data) {
    return await StateMaster.create(data);
  }

  // async findAll(filters = {}) {
  //   return await StateMaster.find({ isDeleted: false, ...filters });
  // }
  // async findAll(filters = {}) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     search = "",
  //     from_date = "",
  //     to_date = "",
  //     active = "",
  //     ...otherFilters
  //   } = filters;

  //   // Build query
  //   let query = { isDeleted: false, ...otherFilters };
  
  //   // Add search filter if provided
  //   if (search) {
  //     query.$or = [
  //       { stateName: { $regex: search, $options: "i" } },
  //       { stateCode: { $regex: search, $options: "i" } },
  //     ];
  //   }

  //   // // Add active filter if provided
  //   // if (active !== "") {
  //   //   query.isActive = active === "true";
  //   // }

  //   // Add date range filter if provided
  //   if (from_date || to_date) {
  //     query.createdAt = {};
  //     if (from_date) query.createdAt.$gte = new Date(from_date);
  //     if (to_date) query.createdAt.$lte = new Date(to_date);
  //   }

  //   // Calculate pagination
  //   const skip = (page - 1) * limit;
  //   const currentPage = parseInt(page);
  //   const pageSize = parseInt(limit);
  //   console.log(query)
  //   // Execute queries in parallel
  //   const [states, totalDocs] = await Promise.all([
  //     StateMaster.find(query)
  //       .populate("id_state")
  //       .sort({ createdAt: -1 })
  //       .skip(skip)
  //       .limit(pageSize),
  //     StateMaster.countDocuments(query),
  //   ]);

  //   // Calculate pagination metadata
  //   const totalPages = Math.ceil(totalDocs / pageSize);
  //   const hasNext = currentPage < totalPages;
  //   const hasPrev = currentPage > 1;

  //   return {
  //     states,
  //     pagination: {
  //       currentPage,
  //       pageSize,
  //       totalDocs,
  //       totalPages,
  //       hasNext,
  //       hasPrev,
  //     },
  //   };
  // }

  async findAll(filters = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    from_date = "",
    to_date = "",
    active = "",
    ...otherFilters
  } = filters;

  // Base query (for fields INSIDE StateMaster)
  let matchStage = { isDeleted: false, ...otherFilters };

  // Date range filter
  if (from_date || to_date) {
    matchStage.createdAt = {};
    if (from_date) matchStage.createdAt.$gte = new Date(from_date);
    if (to_date) matchStage.createdAt.$lte = new Date(to_date);
  }

  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (currentPage - 1) * pageSize;

  // 🔥 AGGREGATION PIPELINE (supports search inside id_state)
  const pipeline = [
    { $match: matchStage },

    // Join State collection
    {
      $lookup: {
        from: "states",            // collection name for the model referenced in id_state
        localField: "id_state",
        foreignField: "_id",
        as: "stateInfo",
      },
    },

    // Convert array → object
    { $unwind: { path: "$stateInfo", preserveNullAndEmptyArrays: true } },
  ];

  //  Apply search (inside id_state)
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "stateInfo.state_name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Sorting
  pipeline.push({ $sort: { createdAt: -1 } });

  // Pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: pageSize });

  // Execute
  const states = await StateMaster.aggregate(pipeline);

  //  COUNT PIPELINE (same as above, but without skip/limit)
  const countPipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "states",
        localField: "id_state",
        foreignField: "_id",
        as: "stateInfo",
      },
    },
    { $unwind: { path: "$stateInfo", preserveNullAndEmptyArrays: true } },
  ];

  if (search) {
    countPipeline.push({
      $match: {
        $or: [
          { "stateInfo.state_name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  countPipeline.push({ $count: "totalDocs" });

  const totalCountResult = await StateMaster.aggregate(countPipeline);
  const totalDocs = totalCountResult[0]?.totalDocs || 0;

  // Pagination metadata
  const totalPages = Math.ceil(totalDocs / pageSize);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    states,
    pagination: {
      currentPage,
      pageSize,
      totalDocs,
      totalPages,
      hasNext,
      hasPrev,
    },
  };
}


  async findById(id) {
    return await StateMaster.findOne({ _id: id, isDeleted: false });
  }

  async findByStateNameOrCode(stateName, stateCode, excludeId = null) {
    const query = {
      isDeleted: false,
      $or: [{ stateName: stateName }, { stateCode: stateCode }],
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await StateMaster.findOne(query);
  }

  async update(id, data) {
    return await StateMaster.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );
  }

  async updateById(id, data) {
    return await StateMaster.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

    async statusChange(id) {
    return await StateMaster.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id) {
    return await StateMaster.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );
  }

  async findByCountry(countryId) {
    return await StateMaster.find({
      countryId: countryId,
      isDeleted: false,
    });
  }

  async restoreState(id) {
    return await StateMaster.findOneAndUpdate(
      { _id: id, isDeleted: true },
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );
  }
}
