class CertificateController {
  constructor(certificateUseCase, validator) {
    this.certificateUseCase = certificateUseCase;
    this.validator = validator;
  }

  async addCertificate(req, res) {
    try {
      const { error } = this.validator.certificateValidations.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await this.certificateUseCase.addCertificate(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(201).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async editCertificate(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No valid id provided" });
      }

      const { error } = this.validator.certificateValidations.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await this.certificateUseCase.editCertificate(id, req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCertificateById(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No object id provided" });
      }

      const result = await this.certificateUseCase.getCertificateById(id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteCertificate(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No id provided" });
      }

      const result = await this.certificateUseCase.deleteCertificate(id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async toggleActiveState(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No document id provided" });
      }

      const result = await this.certificateUseCase.toggleActiveState(id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async certificateTableData(req, res) {
    try {
      const { page, limit, search } = req.body;

      if (isNaN(page) || parseInt(page) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
      }
      if (isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ message: "Invalid limit number" });
      }

      const result = await this.certificateUseCase.certificateTableData(page, limit, search);
      if (!result || !result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({
        message: result.message,
        data: result.data,
        totalDocument: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllCertificates(req, res) {
    try {
      const result = await this.certificateUseCase.getAllCertificates();
      if (!result.success) {
        return res.status(200).json({ message: result.message, data: [] });
      }

      return res.status(200).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default CertificateController;
