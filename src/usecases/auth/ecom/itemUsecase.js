import mongoose from "mongoose";

class ItemUseCase {
  constructor(itemRepository, productRepository, stoneDetailsRepository) {
    this.itemRepository = itemRepository;
    this.productRepository = productRepository;
    this.stoneDetailsRepository = stoneDetailsRepository;
  }

  async createBulkItems(items) {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        return { success: false, message: "Items are required" };
      }

      const tagNumbers = items.map((item) => item.tagNo);

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

        const stoneIds = [];
        const combinedStones = [
          ...(data.stoneData || []).map((s) => ({ ...s, type: "stone" })),
          ...(data.diamondData || []).map((d) => ({ ...d, type: "diamond" })),
        ];

        if (combinedStones.length > 0) {
          try {
            const savedStones =
              await this.stoneDetailsRepository.createMany(combinedStones);
            stoneIds.push(...savedStones.map((s) => s._id));
          } catch (err) {
            console.error("Error saving stones for tag:", data.tagNo, err);
          }
        }

        const itemPayload = {
          productId: data.productId,
          size: data.size || null,
          unit: data.unit || "",
          sizeValue: data.sizeValue || 0,
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

          stoneDetails: stoneIds, // ✅ Store stone IDs

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
        isMrp: findProduct?.isMrp,
      });

      const processedItems = result.data.map((item) => {
        const calculations = this._calculateItemPricing({
          ...item,
          isMrp: findProduct?.isMrp || false,
        });
        return {
          ...item,
          price: calculations.price,
          totalprice: calculations.totalprice,
        };
      });

      return {
        success: true,
        message: "Items fetched successfully",
        data: {
          items: processedItems,
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
    try {
      const item = await this.itemRepository.findById(itemId);

      if (!item) {
        throw new Error("Item not found");
      }

      if (item.status === 2) {
        throw new Error(
          "This item has already been sold and cannot be modified.",
        );
      }

      const forbiddenFields = [
        "productId",
        "size",
        "tagNo",
        "active",
        "status",
        "_id",
      ];

      forbiddenFields.forEach((field) => {
        if (payload[field] !== undefined) {
          delete payload[field];
        }
      });

      if (
        payload.stoneData !== undefined ||
        payload.diamondData !== undefined
      ) {
        try {
          if (item.stoneDetails && item.stoneDetails.length > 0) {
            await mongoose
              .model("StoneDetails")
              .deleteMany({ _id: { $in: item.stoneDetails } });
          }
          const combinedStones = [
            ...(payload.stoneData || []).map((s) => ({
              ...s,
              type: "stone",
              _id: undefined,
            })),
            ...(payload.diamondData || []).map((d) => ({
              ...d,
              type: "diamond",
              _id: undefined,
            })),
          ];

          if (combinedStones.length > 0) {
            const savedStones =
              await this.stoneDetailsRepository.createMany(combinedStones);
            payload.stoneDetails = savedStones.map((s) => s._id);
          } else {
            payload.stoneDetails = [];
          }

          delete payload.stoneData;
          delete payload.diamondData;
        } catch (err) {
          console.error("Error updating stones during item edit:", err);
        }
      }

      const updatedItem = await this.itemRepository.updateItem(itemId, payload);

      return {
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Edit Item Failed: ${error.message}`);
    }
  }

  _calculateItemPricing(item) {
    const rate = Number(item.currentMetalRate || 0);
    const netWt = Number(item.netWeight || 0);
    const grossWt = Number(item.grossWt || 0);

    const metalValue = item.isMrp ? rate : netWt * rate;

    let makingValue = 0;
    const mc = item.makingCharges || {};
    if (Number(mc.makingMode) === 1) {
      makingValue = Number(
        mc.makingDiscountedValue || mc.makingActualValue || 0,
      );
    } else if (Number(mc.makingMode) === 2) {
      const weightBase = Number(mc.calculationType) === 1 ? grossWt : netWt;
      makingValue =
        Number(mc.makingDiscountedValue || mc.makingActualValue || 0) *
        weightBase;
    }

    let wastageValue = 0;
    const wc = item.wastageCharges || {};
    if (Number(wc.wastageMode) === 1) {
      wastageValue = Number(
        wc.wastageDiscountedValue || wc.wastageActualValue || 0,
      );
    } else if (Number(wc.wastageMode) === 2) {
      const weightBase = Number(wc.calculationType) === 1 ? grossWt : netWt;
      const percent = Number(
        wc.wastageDiscountedValue || wc.wastageActualValue || 0,
      );
      wastageValue = (percent / 100) * rate * weightBase;
    }

    let stoneValue = 0;
    let diamondValue = 0
    if (item.stoneDetails && Array.isArray(item.stoneDetails)) {
      item.stoneDetails.forEach((stone) => {
        stoneValue += Number(stone?.weight || 0) * Number(stone?.itemId?.percraterate || 0) + Number(stone?.itemId?.charge || 0);
      });
    }

    const huid = Number(item.huidCharges || 0);
    const subTotal =
      metalValue + makingValue + wastageValue + Number(stoneValue.toFixed(2)) + huid;
    const gstValue = (subTotal * Number(item.gst || 3)) / 100;
    const outprice = subTotal + gstValue;

    const makingActualValue = Number(mc.makingActualValue || 0);
    const wastageActualValue = Number(wc.wastageActualValue || 0);
    const makingActualChargeValue =
      Number(mc.makingMode) === 1
        ? makingActualValue
        : (Number(mc.calculationType) === 1 ? grossWt : netWt) *
        makingActualValue;
    const wastageActualChargeValue =
      Number(wc.wastageMode) === 1
        ? wastageActualValue
        : (wastageActualValue / 100) *
        rate *
        (Number(wc.calculationType) === 1 ? grossWt : netWt);
    const finalOut =
      metalValue +
      makingActualChargeValue +
      wastageActualChargeValue +
      stoneValue +
      huid;
    const findGst = (finalOut * Number(item.gst || 3)) / 100;
    const totalPrice = finalOut + findGst;
    console.log(outprice, totalPrice)
    return {
      price: Number(outprice.toFixed(2)),
      totalprice: Number(totalPrice.toFixed(2)),
    };
  }
}

export default ItemUseCase;
