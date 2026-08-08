import asyncHandler from '../../../utils/errors/asyncHandler.js';
import schemeModel from '../../../infrastructure/models/chit/schemeModel.js';

class SchemeController {
    constructor(schemeUseCase) {
        this.schemeUseCase = schemeUseCase;
    }

    getSchemeCount = asyncHandler(async (req, res) => {
        try {
            for (const key in req.query) {
                if (schemeModel.schema.paths[key]) {
                    const type = schemeModel.schema.paths[key].instance;
                    const val = req.query[key];

                    if (val !== null && val !== undefined && val !== "") {
                        if (type === 'Number' && !isNaN(Number(val))) {
                            req.query[key] = Number(val);
                        } else if (type === 'String') {
                            req.query[key] = String(val);
                        } else if (type === 'Boolean') {
                            req.query[key] = (val === 'true' || val === true || val === 1);
                        } else if (type === 'Date') {
                            req.query[key] = new Date(val);
                        }
                    }
                }
            }

            const count = await this.schemeUseCase.getSchemeCount(req.query);

            res.status(200).json({
                success: true,
                count
            });
        } catch (error) {
            console.error("Error in getSchemeCount controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getSchemeDetails = asyncHandler(async (req, res) => {
        try {
            const details = await this.schemeUseCase.getSchemeDetails(req.query);

            res.status(200).json({
                success: true,
                details
            });
        } catch (error) {
            console.error("Error in getSchemeDetails controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });
}

export default SchemeController;
