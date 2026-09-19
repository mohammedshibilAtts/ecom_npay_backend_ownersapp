import asyncHandler from '../../../utils/errors/asyncHandler.js';
import customerModel from '../../../infrastructure/models/chit/customerModel.js';

class CustomerController {
    constructor(customerUseCase) {
        this.customerUseCase = customerUseCase;
    }

    getCustomers = asyncHandler(async (req, res) => {
        try {
            const data = await this.customerUseCase.getCustomers(req.query);

            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Error in getCustomers controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    setCustomers = asyncHandler(async (req, res) => {
        try {
            const { firstname, mobile, address, gender } = req.body;

            if (!firstname || String(firstname).trim() === "") {
                return res.status(400).json({ success: false, message: "Firstname is mandatory" });
            }
            if (!mobile || isNaN(Number(mobile))) {
                return res.status(400).json({ success: false, message: "Mobile is mandatory and must be a valid number" });
            }
            if (!address || String(address).trim() === "") {
                return res.status(400).json({ success: false, message: "Address is mandatory" });
            }
            if (gender === undefined || gender === null || String(gender).trim() === "") {
                return res.status(400).json({ success: false, message: "Gender is mandatory" });
            }

            for (const key in req.body) {
                if (customerModel.schema.paths[key]) {
                    const type = customerModel.schema.paths[key].instance;
                    const val = req.body[key];

                    if (val !== null && val !== undefined && val !== "") {
                        if (type === 'Number' && !isNaN(Number(val))) {
                            req.body[key] = Number(val);
                        } else if (type === 'String') {
                            req.body[key] = String(val);
                        } else if (type === 'Boolean') {
                            req.body[key] = (val === 'true' || val === true || val === 1);
                        } else if (type === 'Date') {
                            req.body[key] = new Date(val);
                        }
                    }
                }
            }

            const data = await this.customerUseCase.setCustomers(req.body);

            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Error in setCustomers controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    findCustomer = asyncHandler(async (req, res) => {
        try {
            const { mobile } = req.query;

            if (!mobile || isNaN(Number(mobile))) {
                return res.status(400).json({ success: false, message: "Mobile is mandatory and must be a valid number" });
            }

            for (const key in req.query) {
                if (customerModel.schema.paths[key]) {
                    const type = customerModel.schema.paths[key].instance;
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

            const data = await this.customerUseCase.findCustomer(req.query);

            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Error in findCustomer controller:", error);
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    });

    searchCustomerByMobileAndBranch = asyncHandler(async (req, res) => {
        const { branchId } = req.params;
        const { search } = req.query;
        if (!branchId) {
            return res.status(400).json({ message: "Provide a branch id" });
        }
        const result = await this.customerUseCase.searchCustomerByMobileAndBranch(branchId, search);
        if (result && result.success === false) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    });
}

export default CustomerController;
