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
    wishlistRepository,
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
      const customerId = user && user?._id ? user?._id : null;
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
            purityName:
              finalData.purityName ||
              (firstItem && firstItem.purityName ? firstItem.purityName : null),
            isWishlisted: productData.isWishlisted || false,
            purity: productData.purityList || [],
          },
        };
      }

      const itemData = await this.itemRepository.findById(id);

      if (itemData) {
        const parentProduct = await this.productRepository.findById(
          itemData.productId,
          customerId,
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
    const calculations = this._calculateItemPricing({
      ...item,
      isMrp: product?.isMrp || false,
    });

    const { firstItem, purityList, ...cleanProduct } = product;

    return {
      ...cleanProduct,
      _id: item._id,
      itemId: item._id,
      productId: item.productId || product._id,
      purityName:
        product.purityName ||
        item.purityName ||
        (item.id_purity &&
          product.purityList &&
          product.purityList.find(
            (p) => p._id.toString() === item.id_purity.toString(),
          )?.purity_name) ||
        (item.id_purity && typeof item.id_purity === "object"
          ? item.id_purity.purity_name
          : null),
      grossWeight: item.grossWt,
      netWeight: item.netWeight,
      tagNo: item.tagNo,
      sku: product.sku || item.tagNo,
      sizeId: item.size || product.sizeId,
      sizeValue: item.sizeValue,
      unit: item.unit,
      grossWt: item.grossWt,
      netWt: item.netWeight,
      stonewt: item.stonewt,
      diamondcts: item.diamondcts,
      diamondwt: item.diamondwt,
      diaCertificateNo: item.diaCertificateNo,
      huidNo: item.huidNo,
      stoneDetails: item.stoneDetails || item?._doc?.stoneDetails || [],
      price: calculations.price,
      subtotal: calculations.subtotal, //price to subtotal
      totalWithGst: calculations.price, //changed totalPrice to price
      totalAmount: calculations.price,
      discountedAmount: calculations.price,
      totalprice: calculations.totalprice,
      gstamount: calculations.gstValue,

      priceBreakup: {
        metalValue: calculations.metalValue,
        makingValue: calculations.makingValue,
        wastageValue: calculations.wastageValue,
        stoneValue: calculations.stoneValue,
        gstValue: calculations.gstValue,
        huidCharges: item.huidCharges || 0,
      },
      gst: item.gst !== undefined ? item.gst : product.gst,
      latestMetalPrice: item.currentMetalRate || product.latestMetalPrice,
      makingCharges: {
        mode: item.makingCharges?.makingMode || product.makingCharges?.mode,
        actualValue:
          item.makingCharges?.makingActualValue !== undefined
            ? item.makingCharges?.makingActualValue
            : product.makingCharges?.actualValue,
        discountedValue:
          item.makingCharges?.makingDiscountedValue !== undefined
            ? item.makingCharges?.makingDiscountedValue
            : product.makingCharges?.discountedValue,
        discountedPercentage:
          item.makingCharges?.makingDiscountedPercentage !== undefined
            ? item.makingCharges?.makingDiscountedPercentage
            : product.makingCharges?.discountedPercentage,
        discountView:
          item.makingCharges?.discountView ??
          product.makingCharges?.discountView ??
          true,
        mcView:
          item.makingCharges?.mcView ?? product.makingCharges?.mcView ?? true,
        _id: item.makingCharges?._id || product.makingCharges?._id || "MC001",
        wastageView:
          item.makingCharges?.wastageView ??
          product.makingCharges?.wastageView ??
          false,
      },
      wastageCharges: {
        mode: item.wastageCharges?.wastageMode || product.wastageCharges?.mode,
        actualValue:
          item.wastageCharges?.wastageActualValue !== undefined
            ? item.wastageCharges?.wastageActualValue
            : product.wastageCharges?.actualValue,
        discountedValue:
          item.wastageCharges?.wastageDiscountedValue !== undefined
            ? item.wastageCharges?.wastageDiscountedValue
            : product.wastageCharges?.discountedValue,
        discountedPercentage:
          item.wastageCharges?.wastageDiscountedPercentage !== undefined
            ? item.wastageCharges?.wastageDiscountedPercentage
            : product.wastageCharges?.discountedPercentage,
        discountView:
          item.wastageCharges?.discountView ??
          product.wastageCharges?.discountView ??
          true,
        mcView:
          item.wastageCharges?.mcView ??
          product.wastageCharges?.mcView ??
          false,
        _id: item.wastageCharges?._id || product.wastageCharges?._id || "WC001",
        wastageView:
          item.wastageCharges?.wastageView ??
          product.wastageCharges?.wastageView ??
          true,
      },
      orderStatus: {
        alreadyOrdered: false,
        orderId: "",
      },
      stoneDiamondDetails: calculations.stoneDiamondDetails,
      totalDiamondWeight: calculations.totalDiamondWeight,
      totalDiamondCost: calculations.totalDiamondCost,
      totalDiamondPrice: calculations.totalDiamondPrice,
      totalDiamondCount: calculations.totalDiamondCount,
      totalStoneWeight: calculations.totalStoneWeight,
      totalStoneCost: calculations.totalStoneCost,
      totalStonePrice: calculations.totalStonePrice,
      totalStoneCount: calculations.totalStoneCount,
      finalMakingCharge: calculations.makingValue,
      finalWastageCharge: calculations.wastageValue,
      huidCharges: item.huidCharges,
      showHuidCharge: item?.showHuidCharge,
      showHuidNo: item?.showHuidNo,
    };
  }

  _calculateItemPricing(item) {
    const rate = Number(item.currentMetalRate || item?._doc?.currentMetalRate || 0);
    const netWt = Number(item.netWeight || item?._doc?.netWeight || 0);
    const grossWt = Number(item.grossWt || item?._doc?.grossWt || 0);
    const metalValue = item.isMrp ? rate : netWt * rate;

    let makingValue = 0;
    const mc = item.makingCharges || item?._doc?.makingCharges || {};
    if (Number(mc.makingMode) === 1) {
      makingValue = Number(mc.makingDiscountedValue || 0);
    } else if (Number(mc.makingMode) === 2) {
      const weightBase = Number(mc.calculationType) === 1 ? grossWt : netWt;
      makingValue = Number(mc.makingDiscountedValue || 0) * weightBase;
    }

    let wastageValue = 0;
    const wc = item.wastageCharges || item?._doc?.wastageCharges || {};
    if (Number(wc.wastageMode) === 1) {
      wastageValue = Number(wc.wastageDiscountedValue || 0);
    } else if (Number(wc.wastageMode) === 2) {
      const weightBase = Number(wc.calculationType) === 1 ? grossWt : netWt;
      const percent = Number(wc.wastageDiscountedValue || 0);
      wastageValue = (percent / 100) * rate * weightBase;
    }

    let stoneValue = 0;
    let totalDiamondWeight = 0,
      totalDiamondCost = 0,
      totalDiamondPrice = 0,
      totalDiamondCount = 0;
    let totalStoneWeight = 0,
      totalStoneCost = 0,
      totalStonePrice = 0,
      totalStoneCount = 0;
    let stoneDiamondDetails = [];

    if (item.stoneDetails && Array.isArray(item.stoneDetails)) {
      item.stoneDetails.forEach((stone) => {
        const price = Number(stone.price || 0);
        stoneValue += price;

        const detail = {
          _id: stone._id,
          type: stone.type
            ? stone.type.charAt(0).toUpperCase() + stone.type.slice(1)
            : "",
          weight: stone.weight,
          cost: stone.cost,
          price: price,
          stoneInfo: stone.itemId
            ? {
              _id: stone.itemId._id,
              stonename: stone.itemId.stonename,
              percraterate: stone.itemId.percraterate,
            }
            : null,
        };
        stoneDiamondDetails.push(detail);

        if (stone.type === "diamond") {
          totalDiamondWeight += Number(stone.weight || 0);
          totalDiamondCost += Number(stone.cost || 0);
          totalDiamondPrice += price;
          totalDiamondCount += 1;
        } else if (stone.type === "stone") {
          totalStoneWeight += Number(stone.weight || 0);
          totalStoneCost += Number(stone.cost || 0);
          totalStonePrice += price;
          totalStoneCount += 1;
        }
      });
    } else if (item?._doc?.stoneDetails && Array.isArray(item._doc.stoneDetails)) {
      item._doc.stoneDetails.forEach((stone) => {
        const price = Number(stone.price || 0);
        stoneValue += price;

        const detail = {
          _id: stone._id,
          type: stone.type
            ? stone.type.charAt(0).toUpperCase() + stone.type.slice(1)
            : "",
          weight: stone.weight,
          cost: stone.cost,
          price: price,
          stoneInfo: stone.itemId
            ? {
              _id: stone.itemId._id,
              stonename: stone.itemId.stonename,
              percraterate: stone.itemId.percraterate,
            }
            : null,
        };
        stoneDiamondDetails.push(detail);

        if (stone.type === "diamond") {
          totalDiamondWeight += Number(stone.weight || 0);
          totalDiamondCost += Number(stone.cost || 0);
          totalDiamondPrice += price;
          totalDiamondCount += 1;
        } else if (stone.type === "stone") {
          totalStoneWeight += Number(stone.weight || 0);
          totalStoneCost += Number(stone.cost || 0);
          totalStonePrice += price;
          totalStoneCount += 1;
        }
      });
    }

    const huid = Number(item.huidCharges || item?._doc?.huidCharges || 0);
    const gstRate = Number(item.gst || item?._doc?.gst || 3);

    const subTotal = metalValue + makingValue + wastageValue + stoneValue + huid;
    const outprice = Math.round((subTotal + (subTotal * gstRate) / 100) * 100) / 100;

    const makingActualValue = Number(mc.makingActualValue || 0);
    const wastageActualValue = Number(wc.wastageActualValue || 0);
    const makingActualChargeValue = Number(mc.makingMode) === 1 ? makingActualValue : (Number(mc.calculationType) === 1 ? grossWt : netWt) * makingActualValue;
    const wastageActualChargeValue = Number(wc.wastageMode) === 1 ? wastageActualValue : (wastageActualValue / 100) * rate * (Number(wc.calculationType) === 1 ? grossWt : netWt);

    const totalOut = metalValue + makingActualChargeValue + wastageActualChargeValue + stoneValue + huid;
    const totalPrice = Math.round((totalOut + (totalOut * gstRate) / 100) * 100) / 100;

    return {
      price: outprice,
      totalprice: totalPrice,
      metalrate: rate,
      metalValue,
      makingValue,
      wastageValue,
      stoneValue,
      gstValue: Math.round(((subTotal * gstRate) / 100) * 100) / 100,
      discount: Math.round((totalPrice - outprice) * 100) / 100,
      subtotal: subTotal,
      stoneDiamondDetails: stoneDiamondDetails,
      totalDiamondWeight: totalDiamondWeight,
      totalDiamondCost: totalDiamondCost,
      totalDiamondPrice: totalDiamondPrice,
      totalDiamondCount: totalDiamondCount,
      totalStoneWeight: totalStoneWeight,
      totalStoneCost: totalStoneCost,
      totalStonePrice: totalStonePrice,
      totalStoneCount: totalStoneCount,
      finalMakingCharge: makingActualChargeValue,
      finalWastageCharge: wastageActualChargeValue,
      huidCharges: huid,
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
        purityId,
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
        purityId,
      );

      const product = await this.productRepository.findById(productId);

      if (!product) {
        return { success: false, message: "Product not found" };
      }

      const simplifiedItems = items.map((item) => {
        const calculations = this._calculateItemPricing({
          ...item,
          isMrp: product?.isMrp || false,
        });

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
      console.log(simplifiedItems)
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

  async getProductBySubcategory(
    id,
    page = 1,
    limit = 10,
    sort = "latest",
    user,
  ) {
    try {
      const customerId = user && user._id ? user._id : null;
      const { products, currentPage, totalPages, totalDocs } =
        await this.productRepository.getProductBySubcategory(
          id,
          page,
          limit,
          sort,
          customerId,
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
