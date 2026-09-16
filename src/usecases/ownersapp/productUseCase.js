import { isValidObjectId } from "mongoose";
import ActualProductUseCase from "../auth/chit/client/productUseCase.js";

class ProductUseCase {
  constructor(
    productUseCaseOrRepo,
    branchRepository,
    metalRepository,
    categoryRepository,
    purityRepository,
    metalRateRepository,
    s3Service,
    s3rRepo,
    subCategoryRepository,
    itemUseCase
  ) {
    if (productUseCaseOrRepo && typeof productUseCaseOrRepo.addProduct === "function") {
      this.actualProductUseCase = productUseCaseOrRepo;
      this.itemUseCase = branchRepository || itemUseCase;
    } else {
      this.actualProductUseCase = new ActualProductUseCase(
        productUseCaseOrRepo,
        branchRepository,
        metalRepository,
        categoryRepository,
        purityRepository,
        metalRateRepository,
        s3Service,
        s3rRepo,
        subCategoryRepository
      );
      this.itemUseCase = itemUseCase;
    }
  }

  _extractItemData(body) {
    if (!body || typeof body !== "object") return null;

    let rawItem = body.item || body.items || body.itemData;
    if (rawItem && typeof rawItem === "object" && "value" in rawItem) {
      rawItem = rawItem.value;
    }

    if (typeof rawItem === "string") {
      try {
        rawItem = JSON.parse(rawItem);
      } catch (e) {
        console.error("Failed to parse item JSON string:", e);
        return null;
      }
    }

    if (Array.isArray(rawItem)) {
      return rawItem;
    } else if (rawItem && typeof rawItem === "object") {
      return [rawItem];
    }

    return null;
  }

  async addProduct(productData, product_image, files = []) {
    const addProductResult = await this.actualProductUseCase.addProduct(
      productData,
      product_image
    );

    if (addProductResult.success && addProductResult.pid && this.itemUseCase) {
      const itemData = this._extractItemData(productData);

      if (Array.isArray(itemData) && itemData.length > 0) {
        const itemsWithProductId = itemData.map((it) => {
          const itemCopy = { ...it, productId: addProductResult.pid };
          if (itemCopy._id && !isValidObjectId(itemCopy._id)) {
            delete itemCopy._id;
          }
          return itemCopy;
        });

        try {
          const itemResult = await this.itemUseCase.createBulkItems(
            itemsWithProductId,
            files
          );
          addProductResult.itemResult = itemResult;
        } catch (itemErr) {
          console.error("Item bulk creation failed after product creation:", itemErr);
        }
      }
    }

    return addProductResult;
  }

  async editProduct(id, productData, files = []) {
    let productImages = files;
    if (Array.isArray(files)) {
      productImages = files.filter(f => f.fieldname === 'product_image');
    } else if (files && typeof files === 'object' && files.product_image) {
      productImages = files.product_image;
    }

    const updateProduct = await this.actualProductUseCase.editProduct(
      id,
      productData,
      productImages
    );

    if (updateProduct.success && this.itemUseCase) {
      const itemData = this._extractItemData(productData);

      if (Array.isArray(itemData) && itemData.length > 0) {
        const itemResults = [];
        const newItemsToCreate = [];

        for (const item of itemData) {
          const itemId = item._id || item.id;
          if (itemId && isValidObjectId(itemId)) {
            try {
              const updatedItem = await this.itemUseCase.editItem(itemId, item, files);
              itemResults.push(updatedItem);
            } catch (itemErr) {
              console.error(`Item update failed for item ${itemId}:`, itemErr);
            }
          } else {
            const itemCopy = { ...item, productId: id };
            if (itemCopy._id && !isValidObjectId(itemCopy._id)) {
              delete itemCopy._id;
            }
            newItemsToCreate.push(itemCopy);
          }
        }

        if (newItemsToCreate.length > 0) {
          try {
            const createdItems = await this.itemUseCase.createBulkItems(newItemsToCreate, files);
            itemResults.push(createdItems);
          } catch (itemErr) {
            console.error("New items creation failed during product update:", itemErr);
          }
        }

        updateProduct.itemResults = itemResults;
      }
    }

    return updateProduct;
  }

  async deleteProduct(id) {
    return await this.actualProductUseCase.deleteProduct(id);
  }

  async changeStatus(id) {
    return await this.actualProductUseCase.changeStatus(id);
  }

  async toggleSoldStatus(id) {
    return await this.actualProductUseCase.toggleSoldStatus(id);
  }

  async toggleBestSeller(id) {
    return await this.actualProductUseCase.toggleBestSeller(id);
  }

  async findById(id, user) {
    return await this.actualProductUseCase.findById(id, user);
  }

  async getProducts(query, user) {
    return await this.actualProductUseCase.getProducts(query, user);
  }
}

export default ProductUseCase;
