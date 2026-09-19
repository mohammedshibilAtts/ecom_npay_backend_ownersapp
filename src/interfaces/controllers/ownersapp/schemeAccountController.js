import asyncHandler from '../../../utils/errors/asyncHandler.js';

class SchemeAccountController {
    constructor(schemeAccountUseCase) {
        this.schemeAccountUseCase = schemeAccountUseCase;
    }

    getSchemeAccounts = asyncHandler(async (req, res) => {
        const { fromDate, toDate } = req.query;
        const data = await this.schemeAccountUseCase.executeGetSchemeAccounts(fromDate, toDate);

        res.status(200).json({
            success: true,
            data
        });
    });

    searchCustomerByMobile = asyncHandler(async (req, res) => {
        const branchId = req.params.id_branch || req.params.branchId;
        const { mobile, state } = req.query;
        const result = await this.schemeAccountUseCase.searchCustomerByMobile(branchId, mobile, state);
        if (result && result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    });

    customMobileSearch = asyncHandler(async (req, res) => {
        const { id_branch, search_mobile, status } = req.body;
        if (!id_branch) {
            return res.status(400).json({ message: "No branch id provided" });
        }
        const result = await this.schemeAccountUseCase.customMobileSearch(id_branch, search_mobile, status);
        if (result && result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    });

    sendOtpForClose = asyncHandler(async (req, res) => {
        const { mobile, branchId } = req.params;
        if (!branchId) {
            return res.status(400).json({ message: "Provide a branch id" });
        }
        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }
        const result = await this.schemeAccountUseCase.sendOtpForClose(mobile, branchId, req.user);
        if (result && result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    });

    verifyOtp = asyncHandler(async (req, res) => {
        const { mobile, otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: "Otp number is required" });
        }
        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }
        const result = await this.schemeAccountUseCase.verifyOtp(req.body);
        if (result && result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    });

    closeSchemeAccount = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status, id_branch } = req.body;
        if (!id) {
            return res.status(400).json({ message: "No valid id provided" });
        }
        if (!status) {
            return res.status(400).json({ status: "Failed", message: "Status Type is required" });
        }
        if (!id_branch) {
            return res.status(400).json({ status: "Failed", message: "Branch is required" });
        }
        const result = await this.schemeAccountUseCase.closeSchemeAccount(id, req.body, req.user);
        if (result && result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    });

    getSchemeAccountTable = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.body;
        if (!page || isNaN(page) || parseInt(page) <= 0) {
            return res.status(400).json({ message: "Invalid page number" });
        }
        if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
            return res.status(400).json({ message: "Invalid limit number" });
        }
        const result = await this.schemeAccountUseCase.getSchemeAccountTable(req.body);
        if (!result || !result.success) {
            return res.status(200).json({ message: result?.message || "Failed to fetch table data", data: [] });
        }
        return res.status(200).json(result);
    });
}

export default SchemeAccountController;
