import asyncHandler from '../../../utils/errors/asyncHandler.js';

class EmployeeController {
  constructor(employeeUseCase, validator) {
    this.employeeUseCase = employeeUseCase;
    this.validator = validator;
  }

  addEmployee = asyncHandler(async (req, res) => {
    try {
      const {
        firstname,
        mobile,
        gender,
        id_country,
        id_state,
        id_city,
        pincode,
        id_branch,
        aadhar_number,
        date_of_birth,
        date_of_join,
      } = req.body;

      const validate = {
        firstname,
        mobile,
        gender,
        id_country,
        id_branch,
        id_state,
        id_city,
        pincode,
        date_of_birth,
        date_of_join,
        aadhar_number,
      };

      if (this.validator && this.validator.employeeValidations) {
        const { error } = this.validator.employeeValidations.validate(validate);
        if (error) {
          return res.status(400).json({ success: false, message: error.details[0].message });
        }
      }

      const data = { ...req.body };
      data.created_by = req.user?.id_employee || req.ownersAppClient?.id;
      data.modified_by = req.user?.id_employee || req.ownersAppClient?.id;

      const userContext = req.user || req.ownersAppClient || {};
      const result = await this.employeeUseCase.addEmployee(data, req.files, userContext);

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(201).json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error in addEmployee controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  editEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ success: false, message: "No valid id provided" });
      }

      const {
        firstname,
        mobile,
        gender,
        id_country,
        id_state,
        id_city,
        pincode,
        id_branch,
        aadhar_number,
        date_of_birth,
        date_of_join,
      } = req.body;

      const validate = {
        firstname,
        mobile,
        gender,
        id_country,
        id_branch,
        id_state,
        id_city,
        pincode,
        date_of_birth,
        date_of_join,
        aadhar_number,
      };

      if (this.validator && this.validator.employeeValidations) {
        const { error } = this.validator.employeeValidations.validate(validate);
        if (error) {
          return res.status(400).json({ success: false, message: error.details[0].message });
        }
      }

      const data = { ...req.body };
      data.modified_by = req.user?.id_employee || req.ownersAppClient?.id;

      const userContext = req.user || req.ownersAppClient || {};
      const result = await this.employeeUseCase.editEmployee(id, data, req.files, userContext);

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error in editEmployee controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ success: false, message: "No valid id provided" });
      }

      const result = await this.employeeUseCase.deleteEmployee(id);

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error in deleteEmployee controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  activateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ success: false, message: "No valid id provided" });
      }

      const result = await this.employeeUseCase.activateEmployee(id);

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error in activateEmployee controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getAllEmployees = asyncHandler(async (req, res) => {
    try {
      const page = req.body.page || req.query.page || 1;
      const limit = req.body.limit || req.query.limit || 10;
      const search = req.body.search !== undefined ? req.body.search : req.query.search;

      if (!page || isNaN(page) || parseInt(page) <= 0) {
        return res.status(400).json({ success: false, message: "Invalid page number" });
      }
      if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ success: false, message: "Invalid limit number" });
      }

      const result = await this.employeeUseCase.getAllEmployees(page, limit, search);

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        totalDocument: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (error) {
      console.error("Error in getAllEmployees controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getEmployeeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ success: false, message: "No employee id provided" });
      }

      const result = await this.employeeUseCase.getEmployeeById(id);

      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }

      return res.status(200).json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error in getEmployeeById controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getEmployeeByMobile = asyncHandler(async (req, res) => {
    const { search } = req.query;
    try {
      if (!search) {
        return res.status(400).json({ success: false, message: "No mobile number is provided" });
      }

      const result = await this.employeeUseCase.getEmployeeByMobile(search);

      if (!result || !result.success) {
        return res.status(400).json({ success: false, message: result?.message || "Employee not found" });
      }

      return res.status(200).json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error in getEmployeeByMobile controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });
}

export default EmployeeController;
