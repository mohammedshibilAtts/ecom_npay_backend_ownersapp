import mongoose from "mongoose";
import { checkQuantitySize } from "../../../utils/quantityCheckHelper.js";

// src/usecases/cartUseCase.js //using
class CartUseCase {
  constructor(cartRepository, customerRepository, productRepository, itemRepository) {
    this.cartRepository = cartRepository;
    this.customerRepository = customerRepository;
    this.productRepository = productRepository;
    this.itemRepository = itemRepository;
  }

  async createCart(cartData, userData) {
    try {
      const { itemId, collectionId } = cartData;

      if (!userData._id) {
        throw new Error("User ID not found");
      }
      const findUser = await this.customerRepository.findInfo(userData._id);

      if (findUser.active === false) {
        throw new Error("User account is inactive. Please contact support.");
      }

      if (findUser.is_deleted) {
        throw new Error("User account has been deleted.");
      }

      const findCart = await this.cartRepository.findByUserId(userData._id);
      let cartId = findCart && findCart._id ? findCart._id : null;
      cartData.userId = userData._id;
      if (!findCart) {
        const cart = {
          ...cartData,
          status: "active",
        };
        const createCart = await this.cartRepository.create(cart);
        cartId = createCart._id;
      }
      
      const findItem = await this.itemRepository.findById(itemId);
      if (!findItem) {
        return { success: false, message: "Item Not found" };
      }

      const findProduct = await this.productRepository.findById(
        findItem.productId,
        userData._id
      );

      if (!findProduct) {
        return { success: false, message: "Product Not found" };
      }
      const findCartCount = await this.cartRepository.findCartItemCount(cartId);
      if (findCartCount >= 30) {
        return {
          success: false,
          message: "Cart limit reached. Remove an item to continue.",
        };
      }
      const {
        id_category,
        id_metal,
        product_name,
        product_image,
      } = findProduct;
      
      const {
        id_purity,
        grossWt,
        size,
        id_metal: itemMetal,
      } = findItem;

      const safeCollectionId = collectionId && mongoose.isValidObjectId(collectionId)
        ? collectionId
        : null;

      const existingCartItem = await this.cartRepository.findCartItemByItemId(cartId, itemId);
      if (existingCartItem) {
        return { success: false, message: "Item already exists in your cart." };
      }

      const cartItem = {
        cartId: cartId,
        itemId: itemId,
        productId: findItem.productId,
        collectionId: safeCollectionId,
        categoryId: id_category,
        subCategoryId: findProduct?.subcategoryId || null,
        productName: product_name,
        sku: findItem?.tagNo || null,
        image: product_image[0],
        id_metal: id_metal || itemMetal,
        metalWeight: grossWt,
        id_purity: id_purity,
        sizeId: size || null,
      };
      const createItem = await this.cartRepository.addItemToCart(cartItem);
      if (!createItem) {
        return {
          success: false,
          message: "Unable to add the product to your cart. Please try again.",
        };
      }
      await this.cartRepository.updateCartTotals(cartId);
      return {
        success: true,
        message: "Product added to cart",
        data: createItem,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to create cart: ${error.message}`);
    }
  }

  async getCart(userData) {
    try { 
      if (!userData._id) {
        throw new Error("User ID not found");
      }

      const findCart = await this.cartRepository.findCartByUserId(userData._id);

      if (!findCart) {
        throw new Error("Cart not found");
      }

      const cartItems = await this.cartRepository.findById(findCart._id);

      if (!cartItems) {
        return {
          success: false,
          message: "Failed to retrieve cart details.",
          data: cartItems,
        };
      }
      const findAvailableStocks = checkQuantitySize(cartItems.items)
      return {
        success: true,
        message: "Cart details retrieved successfully.",
        data: {
          items: findAvailableStocks,
          overAllAmount: cartItems.overAllAmount,
          pathurl: cartItems.pathurl,
          cartId: cartItems.cartId
        },
      };
    } catch (error) {
      throw new Error(`Failed to get cart: ${error.message}`);
    }
  }

  async findProduct(userData, branchId) {
    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }

      if (!branchId) {
        throw new Error("Branch ID is Required");
      }
      const findCart = await this.cartRepository.findCartByUserId(userData._id);

      if (!findCart) {
        throw new Error("Cart not found");
      }

      const findProduct = await this.cartRepository.findProductByBranch(
        findCart._id,
        branchId
      );
      if (!findProduct) {
        return {
          success: false,
          message: "Failed to retrieve cart details.",
        };
      }

      let message;
      let success;
      if (findProduct && findProduct.length >= 1) {
        message = `${findProduct.length} product(s) are not available in this branch`;
        success = false;
      } else {
        message = "All products are available in this branch";
        success = true;
      }
      return {
        success: true,
        message: "Cart details retrieved successfully.",
        data: {
          products: findProduct,
          message: message,
          success,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get cart: ${error.message}`);
    }
  }
  async removeItemFromCart(itemId, userData) {
    try { console.log(itemId,userData)
      if (!userData._id) {
        throw new Error("User ID not found");
      }

      const findCart = await this.cartRepository.findCartByUserId(userData._id);

      if (!findCart) throw new Error("Cart not found");

      const deleteItem = await this.cartRepository.removeItem(
        itemId,
        findCart._id
      );

      if (!deleteItem) {
        return {
          success: false,
          message:
            "Unable to remove the item from your cart. Please try again.",
        };
      }
      await this.cartRepository.updateCartTotals(findCart._id);
      return {
        success: true,
        message: "Item has been successfully removed from your cart.",
        data: deleteItem,
      };
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
  }
}

export default CartUseCase;
