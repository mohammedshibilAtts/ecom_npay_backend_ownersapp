import BranchRepository from "../infrastructure/repositories/chit/brachRepository.js";
import cacheService from "./cacheService.js";

const branchRepository = new BranchRepository();

export default async function getBranchHelper(branchId) {
  if (!branchId) return null;
  
  const cacheKey = `branch_details_${branchId}`;
  let branchData = cacheService.get(cacheKey);

  if (branchData) {
    return branchData;
  }

  try {
    const branch = await branchRepository.findById(branchId);
    if (!branch) return null;

    branchData = {
      _id: branch._id,
      branch_name: branch.branch_name,
      mobile: branch.mobile,
      address: branch.address,
      city: branch.id_city ? branch.id_city.city_name : "",
      state: branch.id_state ? branch.id_state.state_name : "",
      pincode: branch.pincode,
    };

    cacheService.set(cacheKey, branchData, 1000 * 60 * 60 * 24); // Cache for 24 hours
    return branchData;
  } catch (error) {
    console.error("Error in getBranchHelper:", error);
    return null;
  }
}
