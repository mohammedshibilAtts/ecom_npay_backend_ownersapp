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

    getColorMaster = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getColorMaster();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getColorMaster controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getCertificates = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getCertificates();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getCertificates controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getCollections = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getCollections();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getCollections controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getStoneMasters = asyncHandler(async (req, res) => {
        try {
            const type = req.query.type;
            const data = await this.commonUseCase.getStoneMasters(type);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getStoneMasters controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getTodaysMetalRateByMetal = asyncHandler(async (req, res) => {
        try {
            const metalid = req.query.metal;
            const purity = req.query.purity;
            const branch = req.query.branch;

            if (!purity) {
                return res.status(400).json({ success: false, message: "Purity id is required" });
            }

            if (!metalid) {
                return res.status(400).json({ success: false, message: "Metal id is required" });
            }

            if (!branch) {
                return res.status(400).json({ success: false, message: "Branch id is required" });
            }

            const data = await this.commonUseCase.getTodaysMetalRateByMetal(metalid, purity, branch);

            if (!data) {
                return res.status(404).json({ success: false, message: "No metal rate found" });
            }

            return res.status(200).json({
                success: true,
                message: "Metal rate fetched successfully",
                data,
            });
        } catch (error) {
            console.error("Error in getTodaysMetalRateByMetal controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getDepartment = asyncHandler(async (req, res) => {
        try {
            const data = await this.commonUseCase.getDepartment();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getDepartment controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });
}

export default CommonController;
