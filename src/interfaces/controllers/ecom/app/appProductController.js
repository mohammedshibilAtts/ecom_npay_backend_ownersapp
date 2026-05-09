class AppProductController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async ProductById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }
      const productData = await this.usecase.findById(id, req.user);
      if (productData.success) {
        return res
          .status(200)
          .json({ message: productData.message, data: productData.data });
      }
      return res.status(400).json({ message: productData.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAvailableSizes(req, res) {
    try {
      const { productId, purityId } = req.query;
      const result = await this.usecase.getAvailableSizes(productId, purityId);

      if (result.success) {
        return res
          .status(200)
          .json({ message: result.message, data: result.data });
      }

      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getItemsByCriteria(req, res) {
    try {
      const { productId, size, purity } = req.query;
      const result = await this.usecase.getItemsByCriteria(
        productId,
        size,
        purity
      );

      if (result.success) {
        return res
          .status(200)
          .json({ message: result.message, data: result.data });
      }

      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProductBySubcategory(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10, sort = "latest" } = req.query;

      const result = await this.usecase.getProductBySubcategory(
        id,
        page,
        limit,
        sort
      );

      if (result.success) {
        return res.status(200).json(result);
      }

      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AppProductController;
