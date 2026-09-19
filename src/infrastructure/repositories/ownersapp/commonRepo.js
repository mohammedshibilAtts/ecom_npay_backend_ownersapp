import branchModel from "../../models/chit/branchModel.js";
import CategoryModel from "../../models/chit/categoryModel.js";
import subCategoryModel from "../../models/ecom/subCategoryModel.js";
import metalModel from "../../models/chit/metalModel.js";
import purityModel from "../../models/chit/purityModel.js";
import SchemeTypeModel from "../../models/chit/schemeTypeModel.js";
import installmentTypeModel from "../../models/chit/installmentTypeModel.js";
import schemeClassificationModel from "../../models/chit/schemeClassificationModel.js";
import ColorModel from "../../models/chit/colorModel.js";
import CertificateModel from "../../models/chit/certificateModel.js";
import CollectionModel from "../../models/ecom/collectionModel.js";
import StoneMasterModel from "../../models/ecom/StonemasterModel.js";
import metalRateModel from "../../models/chit/metalRateModel.js";
import DepartmentModel from "../../models/chit/departmentModel.js";
import paymentModeModel from "../../models/chit/paymentModeModel.js";
import { isValidObjectId } from "mongoose";
import { getWastageTypeData, getFundTypeData } from "../../../services/staticDataService.js";

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

    async getMetal() {
        try {
            return await metalModel.find({ active: true, is_deleted: false }).select('metal_name _id id_metal');
        } catch (error) {
            console.error("Error in getMetal repo:", error);
            throw error;
        }
    }

    async getPurityByMetalId(metalId) {
        try {
            const filter = { active: true, is_deleted: false };
            if (metalId) {
                filter.id_metal = metalId;
            }
            return await purityModel.find(filter).select('purity_name _id id_metal id_purity');
        } catch (error) {
            console.error("Error in getPurityByMetalId repo:", error);
            throw error;
        }
    }

    async getSchemeTypes() {
        try {
            return await SchemeTypeModel.find({ active: true, is_deleted: false }).select('scheme_typename _id scheme_type');
        } catch (error) {
            console.error("Error in getSchemeTypes repo:", error);
            throw error;
        }
    }

    async getWastageType() {
        try {
            return getWastageTypeData();
        } catch (error) {
            console.error("Error in getWastageType repo:", error);
            throw error;
        }
    }

    async getFundType() {
        try {
            return getFundTypeData();
        } catch (error) {
            console.error("Error in getFundType repo:", error);
            throw error;
        }
    }

    async getInstallmentType() {
        try {
            return await installmentTypeModel.find({ active: true }).select('-createdAt -updatedAt ');
        } catch (error) {
            console.error("Error in getInstallmentType repo:", error);
            throw error;
        }
    }

    async getClassifications() {
        try {
            return await schemeClassificationModel.find({ active: true, is_deleted: false }).select('-createdAt -updatedAt -is_deleted -active');
        } catch (error) {
            console.error("Error in getClassifications repo:", error);
            throw error;
        }
    }

    async getColorMaster() {
        try {
            return await ColorModel.find({ active: true, isDeleted: false }).select('color code _id');
        } catch (error) {
            console.error("Error in getColorMaster repo:", error);
            throw error;
        }
    }

    async getCertificates() {
        try {
            return await CertificateModel.find({ active: true, isDeleted: false }).select('name id _id');
        } catch (error) {
            console.error("Error in getCertificates repo:", error);
            throw error;
        }
    }

    async getCollections() {
        try {
            return await CollectionModel.find({ active: true, isDeleted: false }).select('name slug icon bannerImage thumbnailImage _id');
        } catch (error) {
            console.error("Error in getCollections repo:", error);
            throw error;
        }
    }

    async getStoneMasters(type = null) {
        try {
            const filter = { active: true, is_deleted: false };
            if (type === "diamond") {
                filter.is_diamond = true;
            } else if (type === "stone") {
                filter.is_diamond = false;
            }
            return await StoneMasterModel.find(filter).select('stonename percraterate charge is_diamond _id stone_cut_id clarity_id color_id shape_id');
        } catch (error) {
            console.error("Error in getStoneMasters repo:", error);
            throw error;
        }
    }

    async getTodaysMetalRateByMetal(metalId, purityId, branchId) {
        try {
            if (!isValidObjectId(metalId) || !isValidObjectId(branchId)) {
                return null;
            }

            const queryDate = new Date();
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
            console.error("Error in getTodaysMetalRateByMetal repo:", error);
            throw error;
        }
    }

    async getDepartment() {
        try {
            return await DepartmentModel.find({ active: true, is_deleted: false }).select('name _id');
        } catch (error) {
            console.error("Error in getDepartment repo:", error);
            throw error;
        }
    }

    async getAllPaymentModes() {
        try {
            return await paymentModeModel.find({ active: true, is_deleted: false }).select('mode_name _id payment_method_type active');
        } catch (error) {
            console.error("Error in getAllPaymentModes repo:", error);
            throw error;
        }
    }
}

export default CommonRepo;
