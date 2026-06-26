class ColorController {
  constructor(colorUseCase, validator) {
    this.colorUseCase = colorUseCase;
    this.validator = validator;
  }

  async addColor(req, res) {
    try {
      const { error } = this.validator.colorValidations.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await this.colorUseCase.addColor(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(201).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async editColor(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No valid id provided" });
      }

      const { error } = this.validator.colorValidations.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await this.colorUseCase.editColor(id, req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getColorById(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No object id provided" });
      }

      const result = await this.colorUseCase.getColorById(id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteColor(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No id provided" });
      }

      const result = await this.colorUseCase.deleteColor(id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async toggleColorActiveState(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "No document id provided" });
      }

      const result = await this.colorUseCase.toggleColorActiveState(id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async colorTableData(req, res) {
    try {
      const { page, limit, search } = req.body;

      if (isNaN(page) || parseInt(page) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
      }
      if (isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ message: "Invalid limit number" });
      }

      const result = await this.colorUseCase.colorTableData(page, limit, search);
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

  async getAllColors(req, res) {
    try {
      const result = await this.colorUseCase.getAllColors();
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

export default ColorController;
