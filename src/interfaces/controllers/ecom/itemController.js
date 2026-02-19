// src/interfaces/controllers/itemController.js

class ItemController {
  constructor(itemUseCase) {
    this.itemUseCase = itemUseCase;
  }

async createBulkItems(req, res) {
  try {
    const result = await this.itemUseCase.createBulkItems(req.body);

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


  async verifyItem(req, res) {
    try {
      const result = await this.itemUseCase.verifyItem(req.params.tagId);

      if (!result.success) {
        return res.status(409).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default ItemController;
