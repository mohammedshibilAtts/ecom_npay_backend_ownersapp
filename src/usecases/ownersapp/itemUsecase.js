import ActualItemUseCase from "../auth/ecom/itemUsecase.js";

class ItemUseCase {
  constructor(itemUseCaseOrRepo, productRepository, stoneDetailsRepository) {
    if (itemUseCaseOrRepo && typeof itemUseCaseOrRepo.createBulkItems === "function") {
      this.actualItemUseCase = itemUseCaseOrRepo;
    } else {
      this.actualItemUseCase = new ActualItemUseCase(
        itemUseCaseOrRepo,
        productRepository,
        stoneDetailsRepository
      );
    }
  }

  async createBulkItems(payload, files = []) {
    console.log("hello",payload)
    return await this.actualItemUseCase.createBulkItems(payload, files);
  }

  async editItem(id, payload, files = []) {
    return await this.actualItemUseCase.editItem(id, payload, files);
  }

  async verifyItem(tagId) {
    return await this.actualItemUseCase.verifyItem(tagId);
  }

  async findByProductId(params) {
    return await this.actualItemUseCase.findByProductId(params);
  }

  async toggleItemStatus(id) {
    return await this.actualItemUseCase.toggleItemStatus(id);
  }
}

export default ItemUseCase;
