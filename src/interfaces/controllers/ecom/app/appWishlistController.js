class AppWishlistController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async toggleWishlist(req, res) {
    try {
      const { productId } = req.body;
      const customerId = req.user.id || req.user._id;
      const id_branch = req.user.id_branch;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      if (!customerId) {
        return res.status(401).json({ message: "User information missing in token" });
      }

      const result = await this.usecase.toggleWishlistItem(customerId, productId, id_branch);
      if (result.success) {
        return res.status(200).json({
          message: result.message,
          inWishlist: result.inWishlist
        });
      }
      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getWishlist(req, res) {
    try {
      const customerId = req?.user?.id || req?.user?._id;
      const result = await this.usecase.getWishlist(customerId);

      if (result.success) {
        return res.status(200).json({
          message: result.message,
          data: { wishlistData: [...result.data] }
        });
      }
      return res.status(400).json({ message: result.message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AppWishlistController;
