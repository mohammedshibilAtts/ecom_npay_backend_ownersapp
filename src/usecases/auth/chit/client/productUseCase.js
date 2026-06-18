import mongoose, { isValidObjectId } from "mongoose";
import config from "../../../../config/chit/env.js";
import s3Helper from "../../../../utils/s3Helper.js";

class ProductUseCase {
  constructor(
    productRepository,
    branchRepository,
    metalRepository,
    categoryRepository,
    purityRepository,
    metalRateRepository,
    s3Service,
    s3rRepo,
    subCategoryRepository
  ) {
    this.productRepository = productRepository;
    this.branchRepository = branchRepository;
    this.metalRepository = metalRepository;
    this.categoryRepository = categoryRepository;
    this.purityRepository = purityRepository;
    this.metalRateRepository = metalRateRepository;
    this.s3Service = s3Service;
    this.s3Respo = s3rRepo;
    this.subCategoryRepository = subCategoryRepository;
  }

  async s3Helper(id_branch) {
    try {
      const s3settings = await this.s3Respo.getSettingByBranch(id_branch);
      if (!s3settings || s3settings.length === 0) {
        return { success: false, message: "S3 configuration not found" };
      }

      const configuration = {
        s3key: s3settings[0].s3key,
        s3secret: s3settings[0].s3secret,
        s3bucket_name: s3settings[0].s3bucket_name,
        s3display_url: s3settings[0].s3display_url,
        region: s3settings[0].region,
      };

      return configuration;
    } catch (error) {
      console.error(error);
      return { success: false, message: "S3 helper error" };
    }
  }

  validateObjectId(id, name) {
    if (id && !isValidObjectId(id)) {
      return { success: false, message: `Provide a valid ${name} ID` };
    }
    return null;
  }

  async addProduct(productData, product_image) {
    try {
      // ===== OBJECT ID VALIDATION =====
      const objectIdValidationErrors = [
        this.validateObjectId(productData.id_branch, "Branch"),
        this.validateObjectId(productData.id_category, "Category"),
        this.validateObjectId(productData.id_metal, "Metal"),
        this.validateObjectId(productData.subcategoryId, "SubCategory"),
      ].filter(Boolean);

      if (objectIdValidationErrors.length) {
        return { success: false, message: objectIdValidationErrors[0].message };
      }

      // ===== SHIM FOR FRONTEND PAYLOAD =====
      if (productData.availableSizes && productData.availableSizes.sizeId) {
        productData.sizeId = productData.availableSizes.sizeId;
      }

      if (!productData.sizeId) {
        return { success: false, message: "Size ID is required" };
      }

      // ===== UNIQUE CHECKS =====
      const checkProductCode = await this.productRepository.findByField({
        code: productData.code,
      });

      if (checkProductCode) {
        return { success: false, message: "Product Code already exists" };
      }

      if (productData.sku) {
        const checkProductSku = await this.productRepository.findByField({
          sku: productData.sku,
        });
        if (checkProductSku) {
          return { success: false, message: "Product SKU already exists" };
        }
      }

      // ===== MASTER EXISTENCE CHECK =====
      const [checkBranchId, checkCategoryId, checkMetalId] = await Promise.all([
        this.branchRepository.findById(productData.id_branch),
        this.categoryRepository.findById(productData.id_category),
        this.metalRepository.findById(productData.id_metal),
      ]);

      if (!checkBranchId) return { success: false, message: "Branch not found" };
      if (!checkCategoryId) return { success: false, message: "Category not found" };
      if (!checkMetalId) return { success: false, message: "Metal not found" };

      // ===== IMAGE UPLOAD =====
      const s3configs = await s3Helper();
      if (s3configs.success === false) return s3configs;

      const uploadPromises = product_image.map(async (image, index) => {
        if (!image.buffer || !image.mimetype || !image.originalname) {
          console.warn(`Skipping invalid image at index ${index}`);
          return null;
        }
        return this.s3Service.uploadToS3(image, "products", s3configs);
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean);
      productData.product_image = uploadedImages;

      // ===== PARSE COLLECTION FIELD =====
      if (productData.collection && typeof productData.collection === "string") {
        try {
          productData.collection = JSON.parse(productData.collection);
        } catch (error) {
          productData.collection = productData.collection.includes(",")
            ? productData.collection.split(",").map((id) => id.trim())
            : [productData.collection];
        }
      }

      // ===== CONVERT BASIC TYPES =====
      if (productData.gst !== undefined) productData.gst = Number(productData.gst);

      const booleanFields = ["showprice", "bestSeller", "onlineProduct", "active", "isMrp"];
      booleanFields.forEach((field) => {
        if (productData[field] !== undefined) {
          productData[field] = productData[field] === "true" || productData[field] === true;
        }
      });

      // ===== SAVE PRODUCT =====
      const saveProduct = await this.productRepository.addProduct(productData);

      if (saveProduct) {
        return { success: true, message: "Product added successfully", pid: saveProduct._id };
      }

      return {
        success: false,
        message: "Failed to add product. Please try again later",
      };
    } catch (err) {
      console.error("Error in addProduct:", err);
      return {
        success: false,
        message: "An error occurred while adding Product.",
        error: err.message,
      };
    }
  }

  async findById(id) {
    try {
      const existingProduct = await this.productRepository.findById(id);

      if (existingProduct) {
        let finalData = existingProduct;
        if (existingProduct.firstItem) {
          finalData = this._mergeItemData(existingProduct, existingProduct.firstItem);
          finalData._id = existingProduct._id;
        }
        return { success: true, message: "Product retrieved successfully", data: finalData };
      }
      return { success: false, message: "Product not found" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error retrieving product", error: err.message };
    }
  }

  async getProducts(query, token) {
    try {
      const { page, limit, from_date, to_date, id_branch, search, active, web = false } = query;
      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const skip = (pageNum - 1) * pageSize;
      const filter = { is_deleted: false };

      if (active == null) {
        filter.active = true;
      }
      if (active !== null && active !== undefined && active !== "") {
        filter.active = active;
      }

      if (query.category) {
        filter.id_category = new mongoose.Types.ObjectId(query.category);
      }
      if (query.onlineProduct) {
        filter.onlineProduct = query.onlineProduct == 1 ? true : false;
      }

      if (from_date && to_date) {
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date format.");
        }
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      if (isValidObjectId(id_branch)) {
        filter.id_branch = new mongoose.Types.ObjectId(id_branch);
      }

      let customer;
      if (token) {
        customer = token._id;
      }

      const searchOptions = search ? { term: search.trim() } : null;

      const products = await this.productRepository.getProducts(
        filter,
        skip,
        pageSize,
        searchOptions,
        customer ? customer : null,
        web
      );

      if (!products.length >= 1) {
        return { success: false, message: "No products found" };
      }

      const totalproducts = await this.productRepository.countProduct(filter, searchOptions, web);

      return {
        success: true,
        message: "Product retrieved successfully",
        allProducts: products,
        totalproducts,
        totalPages: Math.ceil(totalproducts / pageSize),
        currentPage: pageNum,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while get product",
        error: err.message,
      };
    }
  }


  async findByBranchId(id) {
    try {
      const idValidation = this.validateObjectId(id, "Branch");
      if (idValidation) return idValidation;
      const existingBranch = await this.branchRepository.findById(id);

      if (!existingBranch) {
        return { success: false, message: "Branch not existing" };
      }
      const productBranch = await this.productRepository.findByBranchId(id);
      if (productBranch) {
        return {
          success: true,
          message: "Product retrieved successfully",
          data: productBranch,
        };
      }
      return { success: false, message: "Product not found" };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while get product by Branch Id.",
        error: err.message,
      };
    }
  }

  async searchProduct(query) {
    try {
      const {
        page,
        limit,
        from_date,
        to_date,
        id_branch,
        search,
        active,
        category,
        metal,
        subcategory,
      } = query;

      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const skip = (pageNum - 1) * pageSize;

      const filter = { is_deleted: false, active: true };

      if (active !== null && active !== undefined && active !== "") {
        filter.active = active;
      }

      if (category && isValidObjectId(category)) {
        filter.id_category = new mongoose.Types.ObjectId(category);
      }

      if (subcategory && isValidObjectId(subcategory)) {
        filter.id_subcategory = new mongoose.Types.ObjectId(subcategory);
      }

      if (isValidObjectId(id_branch)) {
        filter.id_branch = new mongoose.Types.ObjectId(id_branch);
      }

      if (from_date && to_date) {
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date format.");
        }
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      let searchOptions = {};
      if (search) {
        const regex = new RegExp(search.trim(), "i");
        searchOptions = {
          $or: [
            { product_name: regex },
            { description: regex },
          ],
        };
      }

      const finalFilter = search ? { ...filter, ...searchOptions } : filter;

      const products = await this.productRepository.getProducts(
        finalFilter,
        skip,
        pageSize,
        null,
        null
      );

      if (!products.length) {
        return { success: false, message: "No products found" };
      }

      const totalProducts = await this.productRepository.countProduct(finalFilter);

      return {
        success: true,
        message: "Products retrieved successfully",
        allProducts: products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSize),
        currentPage: pageNum,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while getting products",
        error: err.message,
      };
    }
  }
  async deleteProduct(id) {
    try {
      const result = await this.productRepository.deleteProduct(id);
      return { success: !!result, message: result ? "Product deleted successfully" : "Failed to delete product" };
    } catch (err) {
      return { success: false, message: "Error deleting product", error: err.message };
    }
  }

  async editProduct(id, productData, images) {
    try {
      const idValidation = this.validateObjectId(id, "Product");
      if (idValidation) return idValidation;

      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        return { success: false, message: "Product not found" };
      }

      let updatedImages = existingProduct.product_image || [];

      if (images?.product_image || productData.existing_images) {
        const s3configs = await s3Helper();

        let existingImages = [];
        if (productData.existing_images) {
          try {
            existingImages = JSON.parse(productData.existing_images);
          } catch {
            existingImages = Array.isArray(productData.existing_images)
              ? productData.existing_images
              : [productData.existing_images];
          }
        }

        updatedImages = [...existingImages];

        if (images?.product_image?.length > 0) {
          const uploadPromises = images.product_image.map((image) =>
            this.s3Service.uploadToS3(image, "products", s3configs)
          );
          const uploadedImages = await Promise.all(uploadPromises);
          updatedImages.push(...uploadedImages);
        }
      }

      const booleanFields = [
        "showprice",
        "bestSeller",
        "onlineProduct",
        "active",
        "isMrp",
      ];
      booleanFields.forEach((field) => {
        if (productData[field] !== undefined) {
          productData[field] =
            productData[field] === "true" || productData[field] === true;
        }
      });

      const updateFields = {
        product_name: productData.product_name,
        id_category: productData.id_category,
        subcategoryId: productData.subcategoryId,
        collection: productData.collection,
        description: productData.description,
        product_image: updatedImages,
        isMrp: productData.isMrp,
        onlineProduct: productData.onlineProduct,
        modified_by: productData.modified_by,
        modified_at: new Date(),
      };

      Object.keys(updateFields).forEach(
        (key) => updateFields[key] === undefined && delete updateFields[key]
      );

      const updatedProduct = await this.productRepository.editProduct(updateFields, id);
      return { success: !!updatedProduct, message: updatedProduct ? "Product edited successfully" : "Failed to edit product" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error editing product", error: err.message };
    }
  }

  async changeStatus(id) {
    try {
      const existingProduct = await this.productRepository.findById(id, null, true);
      if (!existingProduct) return { success: false, message: "Product not found" };
      const newStatus = !existingProduct.active;
      const result = await this.productRepository.updateProduct(id, { active: newStatus });
      return { success: !!result, message: `Product ${newStatus ? "activated" : "deactivated"} successfully` };
    } catch (err) {
      return { success: false, message: "Error changing status", error: err.message };
    }
  }

  async getCategoryByCollectionId(id) {
    try {
      const data = await this.productRepository.getCategoryByCollectionId(id);
      const s3configs = await s3Helper();
      const pathurl = s3configs?.s3display_url
        ? `${s3configs.s3display_url}${config.AWS_LOCAL_PATH || "uploads/"}category/`
        : "";

      return {
        success: true,
        message: "Categories fetched successfully",
        data,
        pathUrl: pathurl
      };
    } catch (err) {
      return { success: false, message: "Error fetching categories", error: err.message };
    }
  }

  async getProductBySubcategroy(id, page, limit, token, filter) {
    try {
      const customerId = token?._id;
      const result = await this.productRepository.getProductBySubcategory(id, page, limit, filter, customerId);

      return {
        success: true,
        message: "Products fetched successfully",
        data: result,
      };
    } catch (err) {
      return { success: false, message: "Error fetching products", error: err.message };
    }
  }

  async getProductByCategory(id, page, limit, token, filter) {
    try {
      const customerId = token?._id;
      const result = await this.productRepository.getProductByCategory(id, page, limit, filter, customerId);

      return {
        success: true,
        message: "Products fetched successfully",
        data: result,
      };

    } catch (err) {
      return { success: false, message: "Error fetching products", error: err.message };
    }
  }

  _mergeItemData(product, item) {
    const calculations = this._calculateItemPricing(item);

    return {
      ...product,
      tagNo: item.tagNo,
      sku: product.sku,
      grossWeight: item.grossWt,
      netWeight: item.netWeight,
      currentMetalRate: item.currentMetalRate,
      huidCharges: item.huidCharges,
      huidNo: item.huidNo,
      stoneDetails: item.stoneDetails || item?._doc?.stoneDetails || [],
      price: calculations.price,
      subtotal: calculations.price,
      totalprice: calculations.totalprice,
      totalWithGst: calculations.totalprice,
      discountedAmount: calculations.price,
      stoneValue: calculations.stoneValue,
      gstValue: calculations.gstValue,
      metalValue: calculations.metalValue,
      makingValue: calculations.makingValue,
      wastageValue: calculations.wastageValue,
      priceBreakup: {
        metalValue: calculations.metalValue,
        makingValue: calculations.makingValue,
        wastageValue: calculations.wastageValue,
        stoneValue: calculations.stoneValue,
        huidCharges: calculations.huidCharges,
        gstValue: calculations.gstValue,
      },
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
        discountView: item.makingCharges?.discountView ?? product.makingCharges?.discountView ?? true,
        mcView: item.makingCharges?.mcView ?? product.makingCharges?.mcView ?? true,
        _id: item.makingCharges?._id || product.makingCharges?._id || "MC001",
        wastageView: item.makingCharges?.wastageView ?? product.makingCharges?.wastageView ?? false,
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
        discountView: item.wastageCharges?.discountView ?? product.wastageCharges?.discountView ?? true,
        mcView: item.wastageCharges?.mcView ?? product.wastageCharges?.mcView ?? false,
        _id: item.wastageCharges?._id || product.wastageCharges?._id || "WC001",
        wastageView: item.wastageCharges?.wastageView ?? product.wastageCharges?.wastageView ?? true,
      },
      orderStatus: {
        alreadyOrdered: false,
        orderId: ""
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
    };
  }

  _calculateItemPricing(item) {
    const rate = Number(item.currentMetalRate || 0);
    const netWt = Number(item.netWeight || 0);
    const grossWt = Number(item.grossWt || 0);
    const metalValue = netWt * rate;

    let makingValue = 0;
    const mc = item.makingCharges || {};
    if (Number(mc.makingMode) === 1) {
      makingValue =
        Number(mc.makingActualValue || 0) -
        Number(mc.makingDiscountedValue || 0);
    } else if (Number(mc.makingMode) === 2) {
      makingValue =
        Number(mc.makingActualValue || 0) * grossWt -
        Number(mc.makingDiscountedValue || 0);
    }

    let wastageValue = 0;
    const wc = item.wastageCharges || {};
    if (Number(wc.wastageMode) === 1) {
      wastageValue =
        Number(wc.wastageActualValue || 0) -
        Number(wc.wastageDiscountedValue || 0);
    } else if (Number(wc.wastageMode) === 2) {
      wastageValue =
        metalValue * (Number(wc.wastageActualValue || 0) / 100) -
        Number(wc.wastageDiscountedValue || 0);
    }

    let stoneValue = 0;
    let totalDiamondWeight = 0, totalDiamondCost = 0, totalDiamondPrice = 0, totalDiamondCount = 0;
    let totalStoneWeight = 0, totalStoneCost = 0, totalStonePrice = 0, totalStoneCount = 0;
    let stoneDiamondDetails = [];

    if (item.stoneDetails && Array.isArray(item.stoneDetails)) {
      item.stoneDetails.forEach(stone => {
        const price = Number(stone.price || 0);
        stoneValue += price;

        const detail = {
          _id: stone._id,
          type: stone.type ? stone.type.charAt(0).toUpperCase() + stone.type.slice(1) : "",
          weight: stone.weight,
          cost: stone.cost,
          price: price,
          stoneInfo: stone.itemId ? {
            _id: stone.itemId._id,
            stonename: stone.itemId.stonename,
            percraterate: stone.itemId.percraterate,
          } : null
        };
        stoneDiamondDetails.push(detail);

        if (stone.type?.toLowerCase() === "diamond") {
          totalDiamondWeight += Number(stone.weight || 0);
          totalDiamondCost += Number(stone.cost || 0);
          totalDiamondPrice += price;
          totalDiamondCount += 1;
        } else {
          totalStoneWeight += Number(stone.weight || 0);
          totalStoneCost += Number(stone.cost || 0);
          totalStonePrice += price;
          totalStoneCount += 1;
        }
      });
    }

    const huidCharges = Number(item.huidCharges || 0);
    const subTotal = metalValue + makingValue + wastageValue + stoneValue + huidCharges;
    const gstValue = subTotal * 0.03;
    const totalprice = subTotal + gstValue;

    return {
      price: Math.round(subTotal),
      totalprice: Math.round(totalprice),
      metalValue,
      makingValue,
      wastageValue,
      stoneValue,
      huidCharges,
      gstValue,
      stoneDiamondDetails,
      totalDiamondWeight,
      totalDiamondCost,
      totalDiamondPrice,
      totalDiamondCount,
      totalStoneWeight,
      totalStoneCost,
      totalStonePrice,
      totalStoneCount
    };
  }

  async getProductStockReport(page, limit, search, from_date, to_date, category, subcategory) {
    try {
      const result = await this.productRepository.getProductStockReport(page, limit, { search, from_date, to_date, category, subcategory });
      return { success: true, message: "Stock report fetched successfully", ...result };
    } catch (err) {
      return { success: false, message: "Error fetching stock report", error: err.message };
    }
  }

  async getProductLowStockReport(page, limit, lowstock) {
    try {
      const response = await this.productRepository.getProductLowStockReport(page, limit, lowstock);
      return response;
    } catch (err) {
      return { success: false, message: "Error fetching low stock report", error: err.message };
    }
  }

  async toggleBestSeller(id) {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) return { success: false, message: "Product not found" };
      const newStatus = !existingProduct.bestSeller;
      const result = await this.productRepository.updateProduct(id, { bestSeller: newStatus });
      return { success: !!result, message: `Product ${newStatus ? "added to" : "removed from"} best sellers` };
    } catch (err) {
      return { success: false, message: "Error toggling best seller", error: err.message };
    }
  }

  async allProductsData(query, token) {
    return this.getProducts(query, token);
  }
}

export default ProductUseCase;