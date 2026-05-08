import projectAccessModel from "./projectAccessRepository.js";
import Branch from "../brachRepository.js";

class ConfigurationRepository {
  async getFilteredAccess(filter, skip, limit) {
    return await projectAccessModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate("id_branch")
      .exec();
  }

  async getSetting(model, filter) {
    return await model.findOne(filter);
  }

  async countBranches(filter) {
    return await Branch.countDocuments(filter);
  }
}

export default ConfigurationRepository;
