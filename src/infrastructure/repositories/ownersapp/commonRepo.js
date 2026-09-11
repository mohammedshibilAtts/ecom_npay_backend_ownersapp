import branchModel from "../../models/chit/branchModel.js";
import CategoryModel from "../../models/chit/categoryModel.js";
import subCategoryModel from "../../models/ecom/subCategoryModel.js";

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

    async getActiveCategory() {
        try {
            return await CategoryModel.find({ active: true, is_deleted: false }).select('category_name _id');
        } catch (error) {
            console.error("Error in getActiveCategory repo:", error);
            throw error;
        }
    }

    async getSubcategoryByCategory(categoryId) {
        try {
            const filter = { active: true, isDeleted: false };
            if (categoryId) {
                filter.categoryId = categoryId;
            }
            return await subCategoryModel.find(filter).select('name _id categoryId');
        } catch (error) {
            console.error("Error in getSubcategoryByCategory repo:", error);
            throw error;
        }
    }
}

export default CommonRepo;
