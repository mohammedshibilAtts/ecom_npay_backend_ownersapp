class AppWishlistUsecase {
  constructor(wishlistRepository, productRepository, appProductUsecase) {
    this.wishlistRepository = wishlistRepository;
    this.productRepository = productRepository;
    this.appProductUsecase = appProductUsecase;
  }

  async toggleWishlistItem(customerId, productId, id_branch) {
    try {
      const exists = await this.wishlistRepository.findOne({
        itemId: productId,
        id_customer: customerId,
      });

      if (exists) {
        await this.wishlistRepository.removedFromWishlist({
          itemId: productId,
          id_customer: customerId,
        });
        return { success: true, message: "Removed from wishlist", inWishlist: false };
      } else {
        await this.wishlistRepository.addToWishlist({
          itemId: productId,
          id_customer: customerId,
          id_branch: id_branch,
          createdDate: new Date(),
        });
        return { success: true, message: "Added to wishlist", inWishlist: true };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error toggling wishlist item" };
    }
  }

  async getWishlist(customerId) {
    try {
      const wishlistItems = await this.wishlistRepository.find({
        id_customer: customerId,
      });

      if (!wishlistItems || wishlistItems.length === 0) {
        return { success: true, message: "Wishlist is empty", data: [] };
      }

      const productIds = wishlistItems.map((item) => item.itemId);
      
      const products = await this.productRepository.getProducts(
        { _id: { $in: productIds }, is_deleted: false },
        0,
        100,
        {}
      );

      const processedProducts = (products || []).map((product) => {
        if (product.firstItem) {
          const pricing = this.appProductUsecase._calculateItemPricing(product.firstItem);
          product.price = pricing.price;
          product.totalprice = pricing.totalprice;
          product.status = product.firstItem.status ?? null;
          delete product.firstItem;
        } else {
          product.price = 0;
          product.totalprice = 0;
          product.status = null;
        }

        // Cleanup unwanted fields
        delete product.createdAt;
        delete product.stock;
        delete product.quantity;
        delete product.branchName;
        delete product.metalName;
        delete product.updatedAt;
        delete product.__v;

        product.productId = product._id;
        return product;
      });

      return {
        success: true,
        message: "Wishlist retrieved successfully",
        data: processedProducts,
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error retrieving wishlist" };
    }
  }
}

export default AppWishlistUsecase;
