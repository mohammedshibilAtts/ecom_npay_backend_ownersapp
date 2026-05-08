import StaffUserModel from "../../models/chit/staffUserModel.js";

class StaffRepository {
  async findById(id) {
    const staffData = await StaffUserModel.findById(id).select(
      "-password -createdAt -updatedAt -__v"
    );

    if (!staffData) return null;

    return staffData;
  }

  async findOne(query) { 
    const staffData = await StaffUserModel.findOne(query);

    if (!staffData) return null;

    return staffData;
  }

  async addStaff(data) {
    const staffData = await StaffUserModel.create(data);
    if (!staffData) return null;

    return staffData;
  }

  async editStaff(id, data) {
    const updatedData = await StaffUserModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!updatedData) return null;

    return updatedData;
  }

  async toggleStaffStatus(id, active) {
    const updatedData = await StaffUserModel.findOneAndUpdate(
      { _id: id },
      { $set: { active: !active } },
      { new: true }
    );

    if (!updatedData) return null;

    return updatedData;
  }

async getAllStaffs({ query, documentskip, documentlimit }) {
    try {
      const pipeline = [];
  
      if (query && Object.keys(query).length > 0) {
        pipeline.push({ $match: query });
      }

      pipeline.push({
        $addFields: {
          access_branch_objId: {
            $cond: [
              { $regexMatch: { input: "$access_branch", regex: /^[0-9a-fA-F]{24}$/ } },
              { $toObjectId: "$access_branch" },
              null
            ]
          }
        }
      });
  
      pipeline.push({
        $lookup: {
          from: "branches",
          localField: "id_branch",
          foreignField: "_id",
          as: "id_branch"
        }
      }, {
        $unwind: {
          path: "$id_branch",
          preserveNullAndEmptyArrays: true
        }
      });

      pipeline.push({
        $lookup: {
          from: "employees",
          localField: "id_employee",
          foreignField: "_id",
          as: "id_employee"
        }
      }, {
        $unwind: {
          path: "$id_employee",
          preserveNullAndEmptyArrays: true
        }
      });
      
  
      pipeline.push({
        $lookup: {
          from: "userroles",
          localField: "id_role",
          foreignField: "_id",
          as: "id_role"
        }
      }, {
        $unwind: {
          path: "$id_role",
          preserveNullAndEmptyArrays: true
        }
      });
  
      pipeline.push({
        $lookup: {
          from: "branches",
          localField: "access_branch_objId",
          foreignField: "_id",
          as: "access_branch"
        }
      });


      pipeline.push({
        $project: {
          username: 1,
          active: 1,
          roleNumber: 1,
          id_project: 1,
          id_client: 1,
          id_employee: {
            _id: "$id_employee._id",
            employeeId: "$id_employee.employeeId",
          },
          id_role: {
            _id: "$id_role._id",
            role_name: "$id_role.role_name",
            roleNumber:"$id_role.id_role"
          },
          id_branch: {
            _id: "$id_branch._id",
            branch_name: "$id_branch.branch_name"
          },
          access_branch: {
            $map: {
              input: "$access_branch",
              as: "branch",
              in: {
                _id: "$$branch._id",
                branch_name: "$$branch.branch_name"
              }
            }
          }
        }
      });

      pipeline.push({
        $facet: {
          data: [
            { $sort: { _id: -1 } },
            { $skip: documentskip },
            { $limit: documentlimit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      });
  
      const result = await StaffUserModel.aggregate(pipeline);
  
      const staffData = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;

      return { data: staffData, totalCount };
  
    } catch (error) {
      console.error("Error in getAllStaffs aggregation:", error);
      throw error;
    }
  }

  async deleteProject(id) {
    const updatedData = await StaffUserModel.findOneAndUpdate(
      { _id: id },
      { $set: { is_deleted: true, active: false } },
      { new: true }
    );

    if (!updatedData) {
      return null;
    }

    return updatedData;
  }
}

export default StaffRepository;
