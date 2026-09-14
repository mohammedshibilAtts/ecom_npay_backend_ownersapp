import asyncHandler from '../../../utils/errors/asyncHandler.js';

class CommonController {
    constructor(commonUseCase) {
        this.commonUseCase = commonUseCase;
    }

    getGender = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getGender();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getGender controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getBranch = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getBranch();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getBranch controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getActiveCategory = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getActiveCategory();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getActiveCategory controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getSubcategoryByCategory = asyncHandler(async (req, res) => {
        try {
            const categoryId = req.params.categoryId || req.query.categoryId;
            const data = await this.commonUseCase.getSubcategoryByCategory(categoryId);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getSubcategoryByCategory controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getMetal = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getMetal();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getMetal controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getPurityByMetalId = asyncHandler(async (req, res) => {
        try {
            const metalId = req.params.metalId || req.query.metalId || req.params.id || req.query.id;
            const data = await this.commonUseCase.getPurityByMetalId(metalId);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getPurityByMetalId controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getSchemeTypes = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getSchemeTypes();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getSchemeTypes controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getWastageType = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getWastageType();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getWastageType controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getFundType = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getFundType();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getFundType controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getInstallmentType = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getInstallmentType();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getInstallmentType controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getClassifications = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getClassifications();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getClassifications controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });
}

export default CommonController;
