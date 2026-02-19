// src/usecases/itemUseCase.js

class ItemUseCase {
  constructor(itemRepository, productRepository) {
    this.itemRepository = itemRepository;
    this.productRepository = productRepository;
  }

  async createBulkItems(items) {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        return { success: false, message: "Items are required" };
      }

      // 🔎 Collect all tag numbers
      const tagNumbers = items.map((item) => item.tagNo);

      // 🔎 Find existing tags in DB
      const existingTags =
        await this.itemRepository.findExistingTags(tagNumbers);

      const existingTagSet = new Set(existingTags.map((i) => i.tagNo));

      const validItems = [];
      const skippedItems = [];

      for (const data of items) {
        if (!data.productId || !data.tagNo) {
          skippedItems.push({
            tagNo: data.tagNo,
            reason: "ProductId or Tag missing",
          });
          continue;
        }

        if (existingTagSet.has(data.tagNo)) {
          skippedItems.push({
            tagNo: data.tagNo,
            reason: "Tag already exists",
          });
          continue;
        }

        const itemPayload = {
          productId: data.productId,
          size: data.size || null,
          id_purity: data.id_purity,
          currentMetalRate: Number(data.currentMetalRate || 0),
          tagNo: data.tagNo,

          grossWt: Number(data.grossWt || 0),
          netWeight: Number(data.netWeight || 0),

          stonewt: Number(data.stonewt || 0),
          diamondcts: Number(data.diamondcts || 0),
          diamondwt: Number(data.diamondwt || 0),

          diaCertificateNo: data.diaCertificateNo || "",

          huidCharges: Number(data.huidCharges || 0),
          huidNo: data.huidNo || "",
          showHuidNo: Boolean(data.showHuidNo),
          showHuidCharge: Boolean(data.showHuidCharge),

          gst: Number(data.gst || 0),

          price: Number(data.price || 0),
          totalprice: Number(data.totalprice || 0),

          makingCharges: {
            makingMode: data.makingCharges?.makingMode ?? null,
            calculationType: data.makingCharges?.calculationType ?? null,
            makingActualValue: Number(
              data.makingCharges?.makingActualValue || 0,
            ),
            makingDiscountedPercentage: Number(
              data.makingCharges?.makingDiscountedPercentage || 0,
            ),
            makingDiscountedValue: Number(
              data.makingCharges?.makingDiscountedValue || 0,
            ),
          },

          wastageCharges: {
            wastageMode: data.wastageCharges?.wastageMode ?? null,
            calculationType: data.wastageCharges?.calculationType ?? null,
            wastageActualValue: Number(
              data.wastageCharges?.wastageActualValue || 0,
            ),
            wastageDiscountedPercentage: Number(
              data.wastageCharges?.wastageDiscountedPercentage || 0,
            ),
            wastageDiscountedValue: Number(
              data.wastageCharges?.wastageDiscountedValue || 0,
            ),
          },
        };

        validItems.push(itemPayload);
      }

      if (validItems.length === 0) {
        return {
          success: false,
          message: "All submitted tags already exist.",
          skippedItems,
        };
      }

      const createdItems = await this.itemRepository.bulkCreate(validItems);

      return {
        success: true,
        message: `${createdItems.length} items created successfully`,
        createdCount: createdItems.length,
        skippedCount: skippedItems.length,
        skippedItems,
        data: createdItems,
      };
    } catch (error) {
      throw new Error(`Bulk Create Failed: ${error.message}`);
    }
  }

  async findByProductId(params) {
  try {
    const {
      productId,
      page = 1,
      limit = 10,
      search = "",
      sort = "createdAt",
      order = "desc",
    } = params;

    if (!productId) {
      return {
        success: false,
        message: "Product ID is required",
      };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const result = await this.itemRepository.findByProductId({
      productId,
      page: pageNumber,
      limit: limitNumber,
      search,
      sort,
      order,
    });

    return {
      success: true,
      message: "Items fetched successfully",
      ...result,
    };

  } catch (error) {
    throw new Error(`Failed to fetch items: ${error.message}`);
  }
}


  async verifyItem(tagId) {
    try {
      const findTag = await this.itemRepository.findByTag(tagId);
      if (findTag) {
        return {
          success: false,
          message: "Already Exisiting",
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      throw new Error(`Failed To Verify Tag No: ${error.message}`);
    }
  }
}

export default ItemUseCase;
