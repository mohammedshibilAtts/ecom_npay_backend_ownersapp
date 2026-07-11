import mongoose, { isValidObjectId } from "mongoose";
import s3Helper from "../../../../utils/s3Helper.js";

class OfferUseCase {
  constructor(offerRepository, s3service, s3rRepo) {
    this.offerRepository = offerRepository;
    this.s3service = s3service;
    this.s3rRepo = s3rRepo;
  }

  async addOffer(offerData, offer_images) {
    try {

      if (!isValidObjectId(offerData.id_branch)) {
        return { success: false, message: "Provide a valid Branch ID" };
      }

      const check_Already = await this.offerRepository.findByName(
        offerData.title
      );
      if (check_Already) {
        return { success: false, message: "Offer already exisits." };
      }

      if (offerData.type === 'Offers') {
        const activeCount = await this.offerRepository.countOffers({ type: 'Offers', active: true, is_deleted: false });
        if (activeCount >= 4) {
          return { success: false, message: "Maximum of 4 active offers allowed overall. Please deactivate or delete an existing offer before adding a new one." };
        }
      }

      const { offer_image } = offer_images;

      if (
        (offer_image && offerData.type == 'Offers') ||
        offerData.type == 'Banner' ||
        offerData.type == 'Popup'
      ) {
        const s3configs = await s3Helper()

        const uploadPromises = offer_image.map((image) =>
          this.s3service
            .uploadToS3(image, "offers", s3configs)
            .then((uploadedUrl) => uploadedUrl)
        );
        const uploadedImages = await Promise.all(uploadPromises);
        offerData.offer_image = uploadedImages;
      }

      // Handle category/subcategory/products scope flags
      offerData.categoryOffer = false;
      offerData.subcategoryOffer = false;
      offerData.productOffer = false;

      // Parse productIds if it's sent as a stringified array
      if (typeof offerData.productIds === 'string') {
        try {
          offerData.productIds = JSON.parse(offerData.productIds);
        } catch (e) {
          offerData.productIds = [];
        }
      }
      if (typeof offerData.categoryId === 'string') {
        try {
          offerData.categoryId = JSON.parse(offerData.categoryId);
        } catch (e) {
          offerData.categoryId = [];
        }
      }
      if (typeof offerData.subcategoryId === 'string') {
        try {
          offerData.subcategoryId = JSON.parse(offerData.subcategoryId);
        } catch (e) {
          offerData.subcategoryId = [];
        }
      }

      if (offerData.productIds && Array.isArray(offerData.productIds) && offerData.productIds.length > 0) {
        offerData.productOffer = true;
      } else if (offerData.subcategoryId && Array.isArray(offerData.subcategoryId) && offerData.subcategoryId.length > 0) {
        offerData.subcategoryOffer = true;
      } else if (offerData.categoryId && Array.isArray(offerData.categoryId) && offerData.categoryId.length > 0) {
        offerData.categoryOffer = true;
      }

      const createOffer = await this.offerRepository.addOffer(offerData);
      if (createOffer) {
        return { success: true, message: "Offer Created successfully." };
      } else {
        return { success: false, message: "Failed to create new offer" };
      }
    } catch (err) {

      throw new Error(err);
    }
  }

  async editOffer(offerData, offer_id, offer_images) {
    try {
      if (!isValidObjectId(offer_id)) {
        return { success: false, message: "Provide a valid object ID" };
      }
      if (!isValidObjectId(offerData.id_branch)) {
        return { success: false, message: "Provide a valid Branch ID" };
      }

      const check_Already = await this.offerRepository.findById(offer_id);
      const offerByName = await this.offerRepository.findByName(
        offerData.name,
        offer_id
      );
      if (!check_Already) {
        return { success: false, message: "Offer not found." };
      }
      if (offerByName) {
        return { success: false, message: "Offer already exisits." };
      }

      if (offer_images && Object.entries(offer_images).length !== 0) {
        const { offer_image } = offer_images;
        if (
          (offer_image && offerData.type == 'Offers') ||
          offerData.type == 'Banner' ||
          offerData.type == 'Popup'
        ) {
          const s3configs = await s3Helper()
          const uploadPromises = offer_image.map((image) =>
            this.s3service
              .uploadToS3(image, "offers", s3configs)
              .then((uploadedUrl) => uploadedUrl)
          );
          const uploadedImages = await Promise.all(uploadPromises);
          offerData.offer_image = uploadedImages;
        }
      }

      // Handle category/subcategory/products scope flags
      offerData.categoryOffer = false;
      offerData.subcategoryOffer = false;
      offerData.productOffer = false;

      // Parse productIds, categoryId, subcategoryId if sent as a stringified array
      if (typeof offerData.productIds === 'string') {
        try {
          offerData.productIds = JSON.parse(offerData.productIds);
        } catch (e) {
          offerData.productIds = [];
        }
      }
      if (typeof offerData.categoryId === 'string') {
        try {
          offerData.categoryId = JSON.parse(offerData.categoryId);
        } catch (e) {
          offerData.categoryId = [];
        }
      }
      if (typeof offerData.subcategoryId === 'string') {
        try {
          offerData.subcategoryId = JSON.parse(offerData.subcategoryId);
        } catch (e) {
          offerData.subcategoryId = [];
        }
      }

      if (offerData.productIds && Array.isArray(offerData.productIds) && offerData.productIds.length > 0) {
        offerData.productOffer = true;
      } else if (offerData.subcategoryId && Array.isArray(offerData.subcategoryId) && offerData.subcategoryId.length > 0) {
        offerData.subcategoryOffer = true;
      } else if (offerData.categoryId && Array.isArray(offerData.categoryId) && offerData.categoryId.length > 0) {
        offerData.categoryOffer = true;
      }

      const updateFields = {};

      for (let key in offerData) {
        if (key === "id_branch") {
          if (
            !new mongoose.Types.ObjectId(offerData[key]).equals(
              new mongoose.Types.ObjectId(check_Already[key])
            )
          ) {
            updateFields[key] = offerData[key];
          }
        } else if (
          offerData[key] !== check_Already[key] &&
          offerData[key] !== undefined
        ) {
          updateFields[key] = offerData[key];
        }
      }

      if (Object.keys(updateFields).length === 0 && Object.entries(offer_images).length == 0) {
        return { success: false, message: "No changes found." };
      }

      // Update the offer with the new data
      const updateOffer = await this.offerRepository.updateOffer(
        updateFields,
        offer_id
      );

      if (updateOffer) {
        return { success: true, message: "Offer updated successfully" };
      } else {
        return { success: false, message: "Failed to update Offer" };
      }
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message: "An error occurred while updating the offer.",
        error: err.message,
      };
    }
  }

  async deleteOffer(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }
      const checkOffer = await this.offerRepository.findById(id);

      if (!checkOffer) return { success: false, message: "Offer not found" };

      const deleteOffer = await this.offerRepository.deleteOffer(id);
      if (deleteOffer) {
        return { success: true, message: "Offer deleted successfully" };
      } else {
        return { success: false, message: "Failed to delete Offer" };
      }
    } catch (err) {
      return {
        success: false,
        message: "An error occurred while deleting the offer.",
        error: err.message,
      };
    }
  }

  async changeStatus(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }

      const checkOffer = await this.offerRepository.findById(id);

      if (!checkOffer) {
        return { success: false, message: "Offer not found" };
      }

      if (checkOffer.type === 'Offers' && checkOffer.active === false) {
        const activeCount = await this.offerRepository.countOffers({ type: 'Offers', active: true, is_deleted: false });
        if (activeCount >= 4) {
          return { success: false, message: "Maximum of 4 active offers allowed overall. Please deactivate another offer first before activating this one." };
        }
      }

      const updateStatus = await this.offerRepository.changeStatus(id);

      if (!updateStatus) {
        return { success: false, message: "Failed to change status" };
      }
      let message = checkOffer.active
        ? "Offer deactivated successfully"
        : "Offer activated successfully";
      return { success: true, message: message };
    } catch (err) {
      return {
        success: false,
        message: "An error occurred while changing the offer Status.",
        error: err.message,
      };
    }
  }

  async offerById(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }
      const checkOffer = await this.offerRepository.findById(id);
      if (!checkOffer) {
        return { success: false, message: "Offer not found" };
      } else {
        return {
          success: true,
          message: "Offer retrieved successfully",
          data: checkOffer,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: "An error occurred while getting offer by id.",
        error: err.message,
      };
    }
  }

  async getOfferByBranch(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }
      const branchOffers = await this.offerRepository.findByBranchId(id);
      if (branchOffers.length >= 1) {
        return {
          success: true,
          message: "Offers  retrieved successfully",
          data: branchOffers,
        };
      } else {
        return { success: false, message: "No offers found" };
      }
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message: "An error occurred while getting offer by Branch id.",
        error: err.message,
      };
    }
  }

  async getAllOffers(query) {
    try {
      const { page, limit, from_date, to_date, id_branch, search, active, type } = query;

      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const skip = (pageNum - 1) * pageSize;
      const filter = { active: true, is_deleted: false };

      if (active !== null && active !== undefined && active !== "") {
        filter.active = active;
      }

      if (type) {
        filter.type = type
      }

      if (from_date && to_date) {
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date format.");
        }


        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      // Branch filter
      if (isValidObjectId(id_branch)) {
        filter.id_branch = new mongoose.Types.ObjectId(id_branch)
      }

      // Search filter
      if (search) {
        const searchRegex = new RegExp(search, "i"); // Case-insensitive search
        filter.$or = [{ type: { $regex: searchRegex } }];
      }


      // Fetch offers with filters
      const offers = await this.offerRepository.getOffers(
        filter,
        skip,
        pageSize
      );
      if (!offers.length >= 1) {
        return { success: false, message: "No offers found" };
      }

      // Count the total number of matching offers
      const totalOffers = await this.offerRepository.countOffers(filter);

      return {
        success: true,
        message: "Offers retrieved successfully",
        data: offers,
        totalOffers,
        totalPages: Math.ceil(totalOffers / pageSize),
        currentPage: pageNum,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while getting offers.",
        error: err.message,
      };
    }
  }

  async getAllActiveOffers() {
    try {
      const offers = await this.offerRepository.getAllActiveOffers();

      if (!offers.length >= 1) {
        return { success: false, message: "No offers found" };
      }

      return {
        success: true,
        message: "Offers retrieved successfully",
        data: offers,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while getting offers.",
        error: err.message,
      };
    }
  }

  async getAllActivePopups() {
    try {
      const offers = await this.offerRepository.getAllActivePopups();

      if (!offers.length >= 1) {
        return { success: false, message: "No popup found" };
      }

      return {
        success: true,
        message: "popup retrieved successfully",
        data: offers,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while getting offers.",
        error: err.message,
      };
    }
  }

  async getDropdownCategories() {
    try {
      const data = await this.offerRepository.getDropdownCategories();
      return { success: true, data };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error getting categories" };
    }
  }

  async getDropdownSubcategories(categoryId) {
    try {
      const data = await this.offerRepository.getDropdownSubcategories(categoryId);
      return { success: true, data };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error getting subcategories" };
    }
  }

  async getDropdownProducts(filters) {
    try {
      const result = await this.offerRepository.getDropdownProducts(filters);
      return { success: true, data: result.data, hasMore: result.hasMore };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error getting products" };
    }
  }
}

export default OfferUseCase;
