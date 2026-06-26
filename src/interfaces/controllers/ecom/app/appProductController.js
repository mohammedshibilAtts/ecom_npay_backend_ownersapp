class AppProductController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async ProductById(req, res) {
    try {
      console.log("kdd")
      const rawId = req.params.id;
      const id = rawId ? rawId.replace(/[^a-fA-F0-9]/g, "") : "";

      if (!id || id.length !== 24) {
        return res.status(400).json({ message: "Invalid Product Id" });
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

  async getCategoryFilters(req, res) {
    try {
      const { id } = req.params;
      const result = await this.usecase.getCategoryFilters(id);

      if (result.success) {
        return res.status(200).json({ message: result.message, data: result.data });
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
      const {
        page = 1,
        limit = 10,
        sort = "latest",//price_lth,price_htl,weigt_lth,weigt_htl
        cursor,
        subcategory,
        purity,
        priceRange,
        weightRange,
        search,
        from_date,
        to_date
      } = req.query;

      const filters = {
        sort,
        subcategory,
        purity,
        priceRange,
        weightRange,
        search,
        from_date,
        to_date
      };

      const safeLimit = parseInt(limit, 10) || 10;

      const result = await this.usecase.getProductBySubcategory(
        id,
        page,
        safeLimit,
        filters,
        req.user,
        cursor
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

  async getProductByCategory(req, res) {
    try {
      const { id } = req.params;
      const {
        limit = 10,
        sort = "latest", //price_lth,price_htl,weigt_lth,weigt_htl
        cursor,
        subcategory,
        purity,
        priceRange,
        weightRange,
        search,
        from_date,
        to_date
      } = req.query;

      const filters = {
        sort,
        subcategory,
        purity,
        priceRange,
        weightRange,
        search,
        from_date,
        to_date
      };

      const safeLimit = parseInt(limit, 10) || 10;

      const result = await this.usecase.getProductByCategory(
        id,
        safeLimit,
        filters,
        req.user,
        cursor
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
