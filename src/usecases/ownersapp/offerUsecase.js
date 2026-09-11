import ActualOfferUseCase from "../auth/chit/client/offerUseCase.js";

class OfferUseCase {
  constructor(offerUseCaseOrRepo, s3service, s3rRepo) {
    if (offerUseCaseOrRepo && typeof offerUseCaseOrRepo.addOffer === "function") {
      this.actualOfferUseCase = offerUseCaseOrRepo;
    } else {
      this.actualOfferUseCase = new ActualOfferUseCase(offerUseCaseOrRepo, s3service, s3rRepo);
    }
  }

  async addOffer(offerData, offer_images) {
    return await this.actualOfferUseCase.addOffer(offerData, offer_images);
  }

  async editOffer(offerData, offer_id, offer_images) {
    return await this.actualOfferUseCase.editOffer(offerData, offer_id, offer_images);
  }

  async deleteOffer(id) {
    return await this.actualOfferUseCase.deleteOffer(id);
  }

  async changeStatus(id) {
    return await this.actualOfferUseCase.changeStatus(id);
  }

  async getAllOffers(query) {
    return await this.actualOfferUseCase.getAllOffers(query);
  }

  async getAllActiveOffers() {
    return await this.actualOfferUseCase.getAllActiveOffers();
  }

  async offerById(id) {
    return await this.actualOfferUseCase.offerById(id);
  }
}

export default OfferUseCase;
