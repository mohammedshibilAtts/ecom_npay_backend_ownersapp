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

    addScheme = asyncHandler(async (req, res) => {
        const {
            scheme_name,
            id_metal,
            id_classification,
            scheme_type,
            total_installments,
            id_branch,
            id_purity,
            code,
            description1,
            description2,
            description3,
            description4
        } = req.body;

        if (description1?.length > 50 || description2?.length > 50 || description3?.length > 50 || description4?.length > 50) {
            return res.status(400).json({ message: "More than 50 character no allowed for scheme desciptions" });
        }

        if (scheme_type !== "10" && scheme_type !== "14") {
            if (!req.files || !req.files.logo || (!req.files.logo[0]?.buffer)) {
                return res.status(400).json({ message: "Classification image is required" });
            }
        }

        let requiredFields = '';
        if (scheme_type === "10" || scheme_type === "14") {
            requiredFields = [
                { field: scheme_name, name: 'Scheme Name' },
                { field: id_metal, name: 'Metal Type' },
                { field: scheme_type, name: 'Scheme Type' },
                { field: id_branch, name: 'Branch Id' },
                { field: id_purity, name: 'Purity Id' },
                { field: id_classification, name: 'Classification Id' },
            ];
        } else {
            requiredFields = [
                { field: scheme_name, name: 'Scheme Name' },
                { field: id_metal, name: 'Metal Type' },
                { field: id_classification, name: 'Classification Id' },
                { field: scheme_type, name: 'Scheme Type' },
                { field: total_installments, name: 'Total Installments' },
                { field: id_branch, name: 'Branch Id' },
                { field: id_purity, name: 'Purity Id' },
                { field: code, name: 'Code' }
            ];
        }

        for (const { field, name } of requiredFields) {
            if (field == null || field === '') {
                return res.status(400).json({ message: `${name} is required` });
            }
        }
        const schemeData = req.body;

        if (scheme_type === "10" && !schemeData.code) {
            schemeData.code = "Digigold";
        } else if (scheme_type === "14" && !schemeData.code) {
            schemeData.code = "Digisilver";
        }

        if (req.user) {
            schemeData.created_by = req.user.id_employee || req.user._id;
        }

        const result = await this.schemeUseCase.addScheme(schemeData, req?.files?.logo, req?.files?.desc_img);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(201).json({ message: result.message });
    });

    schemesTableData = asyncHandler(async (req, res) => {
        const { 
            page, 
            limit, 
            search, 
            from_date, 
            to_date, 
            id_classification, 
            metalid, 
            id_purity, 
            weekmonth, 
            scheme_type, 
            installment_type 
        } = req.body;

        let filter = {};

        if (search) {
            filter["$or"] = [
                { scheme_name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } }
            ];
        }
        if (from_date && to_date) {
            filter["createdAt"] = { $gte: new Date(from_date), $lte: new Date(to_date) };
        }

        if (id_classification) filter["id_classification"] = id_classification;
        if (metalid) filter["metalid"] = metalid;
        if (id_purity) filter["id_purity"] = id_purity;
        if (weekmonth) filter["weekmonth"] = weekmonth;
        if (scheme_type) filter["scheme_type"] = scheme_type;
        if (installment_type) filter["installment_type"] = installment_type;

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;

        const result = await this.schemeUseCase.schemesTableData(filter, pageNum, limitNum);

        if (!result || !result.success) {
            return res.status(200).json({ message: result?.message || "No schemes found", data: [] });
        }

        return res.status(200).json({
            message: result.message,
            data: result.data,
            totalDocument: result.totalCount,
            totalPages: result.totalPages,
            currentPage: result.currentPage
        });
    });

    toggleSchemeStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Scheme ID required" });
        }
        const result = await this.schemeUseCase.toggleSchemeStatus(id);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    });

    getDelistSchemes = asyncHandler(async (req, res) => {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            from_date, 
            to_date, 
            id_classification, 
            metalid, 
            id_purity, 
            weekmonth, 
            scheme_type, 
            installment_type 
        } = req.body;

        let filter = {};

        if (search) {
            filter["$or"] = [
                { scheme_name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } }
            ];
        }
        if (from_date && to_date) {
            filter["createdAt"] = { $gte: new Date(from_date), $lte: new Date(to_date) };
        }

        if (id_classification) filter["id_classification"] = id_classification;
        if (metalid) filter["metalid"] = metalid;
        if (id_purity) filter["id_purity"] = id_purity;
        if (weekmonth) filter["weekmonth"] = weekmonth;
        if (scheme_type) filter["scheme_type"] = scheme_type;
        if (installment_type) filter["installment_type"] = installment_type;

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;

        const result = await this.schemeUseCase.getDelistSchemes(filter, pageNum, limitNum);

        if (!result || !result.success) {
            return res.status(200).json({ message: result?.message || "No schemes found", data: [] });
        }

        return res.status(200).json({
            message: result.message,
            data: result.data,
            totalDocument: result.totalCount,
            totalPages: result.totalPages,
            currentPage: result.currentPage
        });
    });

    getSchemeByclassificationId = asyncHandler(async (req, res) => {
        const classId = req.query.classId;
        if (!classId) {
            return res.status(400).json({ message: "No object id provided" });
        }

        const result = await this.schemeUseCase.getSchemeByclassificationId(classId);

        if (!result || !result.success) {
            return res.status(400).json({ message: result?.message || "Scheme not found" });
        }

        return res.status(200).json({ message: result.message, data: result.data, pathUrl: result.pathurl });
    });

    getSchemeById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "No scheme id provided" });
        }

        const result = await this.schemeUseCase.getSchemeById(id);

        if (!result || !result.success) {
            return res.status(400).json({ message: result?.message || "Scheme not found" });
        }

        return res.status(200).json(result);
    });
}


export default SchemeController;
