import projectAccessModel from "../../../models/chit/projectAccessModel.js";

class ProjectAccessRepository {
  async addProjectAccess(data) {
    return await projectAccessModel.create(data);
  }

  async updateProjectAccess(id, data) {
    return await projectAccessModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProjectAccess(id) {
    return await projectAccessModel.updateOne(
      { _id: id },
      { $set: { is_deleted: true, active: false } },
    );
  }

  async activateProjectAccess(id, active) {
    return await projectAccessModel.updateOne(
      { _id: id },
      { active: !active },
      { new: true },
    );
  }

  async getProjectAccessById(id) {
    return await projectAccessModel
      .findById(id)
      .select("-__v -createdAt -updatedAt");
  }

  async getAllActiveProjectAccess() {
    return await projectAccessModel.find({ active: true });
  }

  async projectAccessTable(filter, skip, limit) {
    try {
      const documnetCount = projectAccessModel.countDocuments(filter);
      const data = projectAccessModel
        .find(filter)
        .populate([
          {
            path: "id_branch",
            select: "branch_name",
          },
        ])
        .skip(skip)
        .limit(limit);

      if (!data) {
        return null;
      }

      return { data, documnetCount };
    } catch (error) {
      console.error(error);
    }
    return await projectAccessModel.find(filter);
  }

  async findWithPagination(filter, skip, limit) {
    try {
      return await projectAccessModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate("id_branch")
        .exec();
    } catch (error) {
      console.error("Error fetching project access:", error);
      throw error;
    }
  }
}

export default ProjectAccessRepository;
