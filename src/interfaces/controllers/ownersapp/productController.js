import ProductRepository from "../../../infrastructure/repositories/chit/productRepository.js";

class ProductController {
  constructor(productUseCase, validator) {
    this.productUseCase = productUseCase;
    this.validator = validator;
  }

  async addProduct(req, res) {
    try {
      if (this.validator) {
        const { error } = this.validator.productValidations.validate(req.body, { allowUnknown: true });
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
      }

      let productImages = [];
      let allFiles = [];

      if (Array.isArray(req.files)) {
        allFiles = req.files;
        productImages = req.files.filter(f => f.fieldname === "product_image");
      } else if (req.files && typeof req.files === "object") {
        allFiles = Object.values(req.files).flat();
        productImages = req.files.product_image || [];
      }

      if (!productImages || productImages.length === 0) {
        return res.status(400).json({ message: "Atleast one image required" });
      }

      if (req.user) {
        req.body.created_by = req.user.id_employee || req.user.id;
        req.body.modified_by = req.user.id_employee || req.user.id;
      }

      const addProductResult = await this.productUseCase.addProduct(
        req.body,
        productImages,
        allFiles
      );

      if (addProductResult.success) {
        const productRepo = new ProductRepository();
        productRepo.syncProductStaticFields(null, addProductResult.pid).catch(err => console.error("Sync error:", err));

        return res.status(201).json({
          message: addProductResult.message,
          pid: addProductResult.pid,
          ...(addProductResult.itemResult ? { itemResult: addProductResult.itemResult } : {})
        });
      }
      return res.status(400).json({ message: addProductResult.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async editProduct(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }

      if (this.validator) {
        const { error } = this.validator.productValidations.validate(req.body, { allowUnknown: true });
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
      }
      if (req.user) {
        req.body.modified_by = req.user.id_employee || req.user.id;
      }

      let allFiles = [];
      if (Array.isArray(req.files)) {
        allFiles = req.files;
      } else if (req.files && typeof req.files === "object") {
        allFiles = Object.values(req.files).flat();
      }

      const updateProduct = await this.productUseCase.editProduct(
        id,
        req.body,
        allFiles
      );

      if (updateProduct.success) {
        const productRepo = new ProductRepository();
        productRepo.syncProductStaticFields(null, id).catch(err => console.error("Sync error:", err));

        return res.status(200).json({
          message: updateProduct.message,
          ...(updateProduct.itemResults ? { itemResults: updateProduct.itemResults } : {})
        });
      }
      return res.status(400).json({ message: updateProduct.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }
      const deleteProductResult = await this.productUseCase.deleteProduct(id);
      if (deleteProductResult.success) {
        return res.status(200).json({ message: deleteProductResult.message });
      }
      return res.status(400).json({ message: deleteProductResult.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async changeStatus(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }

      const changeStatus = await this.productUseCase.changeStatus(id);
      if (changeStatus.success) {
        return res.status(200).json({ message: changeStatus.message });
      }
      return res.status(400).json({ message: changeStatus.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async toggleSoldStatus(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }

      const result = await this.productUseCase.toggleSoldStatus(id);
      if (result.success) {
        return res.status(200).json({ message: result.message });
      }
      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async toggleBestSeller(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }

      const changeStatus = await this.productUseCase.toggleBestSeller(id);
      if (changeStatus.success) {
        return res.status(200).json({ message: changeStatus.message });
      }
      return res.status(400).json({ message: changeStatus.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required" });
      }

      const productData = await this.productUseCase.findById(id, req.user);
      if (productData.success) {
        return res.status(200).json({ message: productData.message, data: productData.data });
      }
      return res.status(400).json({ message: productData.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async allProducts(req, res) {
    try {
      const result = await this.productUseCase.getProducts(req.body, req.user);
      if (result.success) {
        return res.status(200).json({
          message: result.message,
          data: result.allProducts,
          ...(result.suggestions ? { suggestions: result.suggestions } : {}),
          ...(result.totalproducts !== undefined && { totalDocument: result.totalproducts }),
          ...(result.totalPages !== undefined && { totalPages: result.totalPages }),
          ...(result.currentPage !== undefined && { currentPage: result.currentPage }),
          ...(result.nextCursor !== undefined && { nextCursor: result.nextCursor }),
          ...(result.hasNextPage !== undefined && { hasNextPage: result.hasNextPage }),
        });
      }
      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default ProductController;
