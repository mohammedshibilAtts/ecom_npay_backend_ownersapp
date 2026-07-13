import asyncHandler from '../../../utils/errors/asyncHandler.js';

class LocationController {
    constructor(locationUseCase) {
        this.locationUseCase = locationUseCase;
    }

    getCountry = asyncHandler(async (req, res) => {
        try {
            const data = await this.locationUseCase.getCountry();
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getCountry controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getState = asyncHandler(async (req, res) => {
        try {
            const { id } = req.query;
            const data = await this.locationUseCase.getState(id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getState controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    getCity = asyncHandler(async (req, res) => {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, message: "State ID is required" });
            }
            const data = await this.locationUseCase.getCity(id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error in getCity controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });
}

export default LocationController;
