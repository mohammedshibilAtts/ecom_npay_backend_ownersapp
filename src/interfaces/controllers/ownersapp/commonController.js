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
}

export default CommonController;
