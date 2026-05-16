// src/controllers/cartController.js
class CartController {
  constructor(cartUseCase) {
    this.cartUseCase = cartUseCase;
  }

  async createCart(req, res) {
    try {
      const cartData = req.body;
      const cart = await this.cartUseCase.createCart(cartData, req.user);

      if (!cart.success) {
        return res.status(400).json({
          success: false,
          message: cart.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: cart.message,
        data: cart.data,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCart(req, res) {
    try {
      const cart = await this.cartUseCase.getCart(req.user);

      if (!cart.success) {
        return res.status(400).json({
          success: false,
          message: cart.message,
        });
      }
      res.status(200).json({
        success: true,
        message: cart.message,
        data: cart.data,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async findProduct(req, res) {
    try {
      const { id } = req.params;
      const cart = await this.cartUseCase.findProduct(req.user, id);

      if (!cart.success) {
        return res.status(400).json({
          success: false,
          message: cart.message,
        });
      }
      res.status(200).json({
        success: true,
        message: cart.message,
        data: cart.data,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeItem(req, res) {
    try {
      const { itemId } = req.body;

      const result = await this.cartUseCase.removeItemFromCart(
        itemId,
        req.user,
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default CartController;
