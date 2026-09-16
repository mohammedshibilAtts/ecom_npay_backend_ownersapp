class ItemController {
  constructor(itemUseCase) {
    this.itemUseCase = itemUseCase;
  }

  async createBulkItems(req, res) {
    try {
      let payload = req.body;
      console.log({payload})
      if (req.body.data) {
        payload = JSON.parse(req.body.data);
      }
      const files = req.files || [];
      const result = await this.itemUseCase.createBulkItems(payload, files);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      let payload = req.body;
      if (req.body.data) {
        payload = JSON.parse(req.body.data);
      }
      const files = req.files || [];
      const result = await this.itemUseCase.editItem(id, payload, files);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyItem(req, res) {
    try {
      const { tagId } = req.params;
      const result = await this.itemUseCase.verifyItem(tagId);

      if (!result.success) {
        return res.status(409).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async findByProductId(req, res) {
    try {
      const { productId } = req.params;
      const { page, limit, search, sort, order } = req.query;

      const result = await this.itemUseCase.findByProductId({
        productId,
        page,
        limit,
        search,
        sort,
        order,
      });

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async toggleItemStatus(req, res) {
    try {
      const { id } = req.params;
      const result = await this.itemUseCase.toggleItemStatus(id);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default ItemController;
