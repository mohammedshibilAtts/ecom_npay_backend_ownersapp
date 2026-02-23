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
          unit:data.unit||"",
          sizeValue:data.sizeValue||0,
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

      const findProduct = await this.productRepository.findById(productId);
      if (!findProduct) {
        return {
          success: false,
          message: "Product Not Found",
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
        data: {
          items: result.data,
          pagination: result.pagination,
          productData: findProduct,
        },
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

  async toggleItemStatus(itemId) {
    try {
      if (!itemId) return { success: false, message: "Item ID required" };

      const item = await this.itemRepository.findById(itemId);

      if (!item) return { success: false, message: "Item not found" };

      // ✅ NEW VALIDATION
      if (item.status === 2) {
        return {
          success: false,
          message: "This item has already been sold and cannot be modified.",
        };
      }

      const updatedItem = await this.itemRepository.updateStatus(
        itemId,
        !item.active,
      );

      return {
        success: true,
        message: updatedItem.active
          ? "Item activated successfully"
          : "Item deactivated successfully",
        data: {
          _id: updatedItem._id,
          active: updatedItem.active,
        },
      };
    } catch (error) {
      throw new Error(`Toggle Item Status Failed: ${error.message}`);
    }
  }

  async editItem(itemId, payload) {
   try{
 const item = await this.itemRepository.findById(itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    // 🔒 Prevent editing sold items
    if (item.status === 2) {
      throw new Error(
        "This item has already been sold and cannot be modified.",
      );
    }

    // 🔒 Remove non-editable fields if someone tries to send them
    const forbiddenFields = [
      "productId",
      "size",
      "tagNo",
      "stonewt",
      "diamondcts",
      "diamondwt",
      "active",
      "status",
      "_id",
    ];

    forbiddenFields.forEach((field) => {
      if (payload[field] !== undefined) {
        delete payload[field];
      }
    });

    const updatedItem = await this.itemRepository.updateItem(itemId, payload);

    return {
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    };
   }catch(error){
    console.log(error)
   }
  }
}

export default ItemUseCase;
