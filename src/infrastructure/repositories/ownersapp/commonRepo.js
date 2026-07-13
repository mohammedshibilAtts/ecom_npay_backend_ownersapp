import branchModel from "../../models/chit/branchModel.js";

class CommonRepo {
    async getGender() {
        return [
            { id: 1, name: "Male" },
            { id: 2, name: "Female" },
            { id: 3, name: "Other" }
        ];
    }
    async getBranch() {
        try {
            return await branchModel.find({ active: true, is_deleted: false }).select('branch_name _id');
        } catch (error) {
            console.error("Error in getBranch repo:", error);
            throw error;
        }
    }
}

export default CommonRepo;
