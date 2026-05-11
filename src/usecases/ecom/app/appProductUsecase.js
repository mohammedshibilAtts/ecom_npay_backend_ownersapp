class AppProductUsecase {
  constructor(
    productRepository,
    branchRepository,
    metalRepository,
    categoryRepository,
    purityRepository,
    metalRateRepository,
    s3Service,
    s3Respo,
    subCategoryRepository,
    itemRepository,
    wishlistRepository
  ) {
    this.productRepository = productRepository;
    this.branchRepository = branchRepository;
    this.metalRepository = metalRepository;
    this.categoryRepository = categoryRepository;
    this.purityRepository = purityRepository;
    this.metalRateRepository = metalRateRepository;
    this.s3Service = s3Service;
    this.s3Respo = s3Respo;
    this.subCategoryRepository = subCategoryRepository;
    this.itemRepository = itemRepository;
    this.wishlistRepository = wishlistRepository;
  }

  async findById(id, user) {
    try {
      const customerId = user && user._id ? user._id : null;
      let productData = await this.productRepository.findById(id, customerId);


      if (productData) {
        let finalData = productData;
        if (productData.firstItem) {
          finalData = this._mergeItemData(productData, productData.firstItem);
          finalData._id = productData._id;
        }

        const { purityList, firstItem, ...restData } = finalData;

        return {
          success: true,
          message: "Product retrieved successfully",
          data: {
            ...restData,
            purityName: finalData.purityName || (firstItem && firstItem.purityName ? firstItem.purityName : null),
            isWishlisted: productData.isWishlisted || false,
            purity: productData.purityList || [],
          },
        };
      }

      // If not found by product ID, try as an item ID
      const itemData = await this.itemRepository.findById(id);
      if (itemData) {
        const parentProduct = await this.productRepository.findById(
          itemData.productId,
          customerId
        );
        
        if (parentProduct) {
          const mergedData = this._mergeItemData(parentProduct, itemData);
          const { purityList, firstItem, ...restData } = mergedData;

          return {
            success: true,
            message: "Product retrieved successfully",
            data: {
              ...restData,
              isWishlisted: parentProduct.isWishlisted || false,
              purity: parentProduct.purityList || [],
            },
          };
        }
      }

      return { success: false, message: "Product not found" };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "Error retrieving product",
        error: err.message,
      };
    }
  }

  _mergeItemData(product, item) {
    const calculations = this._calculateItemPricing(item);
    
    // Remove unwanted nested fields from the parent product before merging
    const { firstItem, purityList, ...cleanProduct } = product;

    return {
      ...cleanProduct,
      _id: item._id, // This is the item ID
      itemId: item._id,
      productId: item.productId || product._id,
      purityName: product.purityName || item.purityName || 
        (item.id_purity && product.purityList && product.purityList.find(p => p._id.toString() === item.id_purity.toString())?.purity_name) || 
        (item.id_purity && typeof item.id_purity === 'object' ? item.id_purity.purity_name : null),
      grossWeight: item.grossWt,
      netWeight: item.netWeight,
      tagNo: item.tagNo,
      sku: item.tagNo || product.sku,
      sizeId: item.size || product.sizeId,
      sizeValue: item.sizeValue,
      unit: item.unit,
      grossWt: item.grossWt,
      netWt: item.netWeight,
      stonewt: item.stonewt,
      diamondcts: item.diamondcts,
      diamondwt: item.diamondwt,
      diaCertificateNo: item.diaCertificateNo,
      huidCharges: item.huidCharges,
      huidNo: item.huidNo,
      price: product.price || calculations.price,
      totalprice: product.totalprice || calculations.totalprice,
      priceBreakup: {
        metalValue: product.metalValue || calculations.metalValue,
        makingValue: product.makingValue || calculations.makingValue,
        wastageValue: product.wastageValue || calculations.wastageValue,
        stoneValue: product.stoneValue || calculations.stoneValue,
        gstValue: product.gstValue || calculations.gstValue,
      },
      gst: item.gst !== undefined ? item.gst : product.gst,
      latestMetalPrice: item.currentMetalRate || product.latestMetalPrice,
      makingCharges: {
        mode: item.makingCharges?.makingMode || product.makingCharges?.mode,
        actualValue:
          item.makingCharges?.makingActualValue !== undefined ? item.makingCharges?.makingActualValue :
          product.makingCharges?.actualValue,
        discountedValue:
          item.makingCharges?.makingDiscountedValue !== undefined ? item.makingCharges?.makingDiscountedValue :
          product.makingCharges?.discountedValue,
        discountedPercentage:
          item.makingCharges?.makingDiscountedPercentage !== undefined ? item.makingCharges?.makingDiscountedPercentage :
          product.makingCharges?.discountedPercentage,
        discountView: product.makingCharges?.discountView,
        mcView: product.makingCharges?.mcView,
      },
      wastageCharges: {
        mode: item.wastageCharges?.wastageMode || product.wastageCharges?.mode,
        actualValue:
          item.wastageCharges?.wastageActualValue !== undefined ? item.wastageCharges?.wastageActualValue :
          product.wastageCharges?.actualValue,
        discountedValue:
          item.wastageCharges?.wastageDiscountedValue !== undefined ? item.wastageCharges?.wastageDiscountedValue :
          product.wastageCharges?.discountedValue,
        discountedPercentage:
          item.wastageCharges?.wastageDiscountedPercentage !== undefined ? item.wastageCharges?.wastageDiscountedPercentage :
          product.wastageCharges?.discountedPercentage,
        discountView: product.wastageCharges?.discountView,
        wastageView: product.wastageCharges?.wastageView,
      },
    };
  }

  _calculateItemPricing(item) {
    const rate = Number(item.currentMetalRate || 0);
    const netWt = Number(item.netWeight || 0);
    const grossWt = Number(item.grossWt || 0);
    const metalValue = netWt * rate;

    // Making Charges
    let makingValue = 0;
    const mc = item.makingCharges || {};
    // mode 1: Amount, mode 2: Weight
    if (Number(mc.makingMode) === 1) {
      makingValue =
        Number(mc.makingActualValue || 0) -
        Number(mc.makingDiscountedValue || 0);
    } else if (Number(mc.makingMode) === 2) {
      makingValue =
        Number(mc.makingActualValue || 0) * grossWt -
        Number(mc.makingDiscountedValue || 0);
    }

    // Wastage Charges
    let wastageValue = 0;
    const wc = item.wastageCharges || {};
    // mode 1: Amount, mode 2: Percentage
    if (Number(wc.wastageMode) === 1) {
      wastageValue =
        Number(wc.wastageActualValue || 0) -
        Number(wc.wastageDiscountedValue || 0);
    } else if (Number(wc.wastageMode) === 2) {
      wastageValue =
        metalValue * (Number(wc.wastageActualValue || 0) / 100) -
        Number(wc.wastageDiscountedValue || 0);
    }

    // Stones (Calculated if populated, otherwise use 0)
    let stoneValue = 0;
    if (item.stoneDetails && Array.isArray(item.stoneDetails)) {
      stoneValue = item.stoneDetails.reduce(
        (sum, stone) => sum + Number(stone.price || 0),
        0
      );
    }

    const huid = Number(item.huidCharges || 0);
    const subTotal =
      metalValue + makingValue + wastageValue + stoneValue + huid;
    const gstValue = (subTotal * Number(item.gst || 0)) / 100;
    const totalPrice = subTotal + gstValue;

    return {
      price: Math.round(subTotal),
      totalprice: Math.round(totalPrice),
      metalValue,
      makingValue,
      wastageValue,
      stoneValue,
      gstValue,
    };
  }

  async getAvailableSizes(productId, purityId) {
    try {
      if (!productId || !purityId) {
        return {
          success: false,
          message: "Product ID and Purity ID are required",
        };
      }

      const sizes = await this.itemRepository.getSizesByPurity(
        productId,
        purityId
      );

      return {
        success: true,
        message: "Available sizes retrieved successfully",
        data: sizes,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "Error retrieving available sizes",
        error: err.message,
      };
    }
  }

  async getItemsByCriteria(productId, sizeValue, purityId) {
    try {
      if (!productId || !sizeValue || !purityId) {
        return {
          success: false,
          message: "Product ID, size, and purity ID are required",
        };
      }

      const items = await this.itemRepository.getItemsByCriteria(
        productId,
        sizeValue,
        purityId
      );
      const product = await this.productRepository.findById(productId);

      if (!product) {
        return { success: false, message: "Product not found" };
      }

      const simplifiedItems = items.map((item) => {
        const calculations = this._calculateItemPricing(item);
        return {
          _id: item._id,
          tagNo: item.tagNo,
          grossWt: item.grossWt,
          netWeight: item.netWeight,
          price: calculations.price,
          totalprice: calculations.totalprice,
          gst: item.gst,
          latestMetalPrice: item.currentMetalRate,
          makingCharges: {
            mode: item.makingCharges?.makingMode,
            actualValue: item.makingCharges?.makingActualValue,
            discountedValue: item.makingCharges?.makingDiscountedValue,
          },
          wastageCharges: {
            mode: item.wastageCharges?.wastageMode,
            actualValue: item.wastageCharges?.wastageActualValue,
            discountedValue: item.wastageCharges?.wastageDiscountedValue,
          },
        };
      });

      return {
        success: true,
        message: "Items retrieved successfully",
        data: simplifiedItems,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "Error retrieving items",
        error: err.message,
      };
    }
  }

  async getProductBySubcategory(id, page = 1, limit = 10, sort = "latest", user) {
    try {
      const customerId = user && user._id ? user._id : null;
      const { products, currentPage, totalPages, totalDocs } = await this.productRepository.getProductBySubcategory(
        id,
        page,
        limit,
        sort,
        customerId
      );

      return {
        success: true,
        message: "Products retrieved successfully",
        data: products,
        currentPage,
        totalPages,
        totalDocs,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "Error retrieving products",
        error: err.message,
      };
    }
  }
}

export default AppProductUsecase;