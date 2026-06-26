import mongoose from "mongoose";
import s3Helper from "../../../utils/s3Helper.js";
import S3Service from "../../../utils/s3Bucket.js";

const s3Service = new S3Service();

class ItemUseCase {
  constructor(itemRepository, productRepository, stoneDetailsRepository) {
    this.itemRepository = itemRepository;
    this.productRepository = productRepository;
    this.stoneDetailsRepository = stoneDetailsRepository;
  }

  async createBulkItems(payload, files = []) {
    try {
      let items = payload;
      if (typeof items === "string") {
        items = JSON.parse(items);
      }
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid payload: expected an array of items.");
      }

      const s3configs = await s3Helper();
      const uploadedFiles = {};
      
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.fieldname === "diaCertificateFile" || file.fieldname.startsWith("diaCertificateFile_")) {
            const fileName = await s3Service.uploadToS3(file, "certificates", s3configs);
            if (!uploadedFiles[file.fieldname]) {
              uploadedFiles[file.fieldname] = [];
            }
            uploadedFiles[file.fieldname].push(fileName);
          }
        }
      }

      const tagNumbers = items.map((item) => item.tagNo);

      const existingTags =
        await this.itemRepository.findExistingTags(tagNumbers);

      const existingTagSet = new Set(existingTags.map((i) => i.tagNo));

      const validItems = [];
      const skippedItems = [];

      for (let i = 0; i < items.length; i++) {
        const data = items[i];
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

        let diacertificateUrls = [];
        const fileKey = `diaCertificateFile_${i}`;
        if (uploadedFiles[fileKey]) {
          diacertificateUrls = uploadedFiles[fileKey];
        } else if (uploadedFiles["diaCertificateFile"] && items.length === 1) {
          diacertificateUrls = uploadedFiles["diaCertificateFile"];
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
          // unit: data.unit || "",
          sizeValue: data.sizeValue || 0,
          id_purity: data.id_purity,
          id_color: data.id_color || null,
          id_certificate: data.id_certificate || null,
          currentMetalRate: Number(data.currentMetalRate || 0),
          tagNo: data.tagNo,

          grossWt: Number(data.grossWt || 0),
          netWeight: Number(data.netWeight || 0),

          stonewt: Number(data.stonewt || 0),
          diamondcts: Number(data.diamondcts || 0),
          diamondwt: Number(data.diamondwt || 0),

          diaCertificateNo: data.diaCertificateNo || "",
          diacertificate: diacertificateUrls.length > 0 ? diacertificateUrls : (Array.isArray(data.diacertificate) ? data.diacertificate : (data.diacertificate ? [data.diacertificate] : [])),

          huidCharges: Number(data.huidCharges || 0),
          huidNo: data.huidNo || "",
          showHuidNo: Boolean(data.showHuidNo),
          showHuidCharge: Boolean(data.showHuidCharge),

          gst: Number(data.gst || 0),

          price: Number(data.price || 0),
          totalprice: Number(data.totalprice || 0),

          stoneDetails: stoneIds,

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

      const uniqueProductIds = [...new Set(validItems.map(item => item.productId.toString()))];
      for (const pId of uniqueProductIds) {
        this.productRepository.syncProductStaticFields(null, pId).catch(err => console.error("Sync error:", err));
      }

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

      // if (item.status === 2) {
      //   return {
      //     success: false,
      //     message: "This item has already been sold and cannot be modified.",
      //   };
      // }

      const updatedItem = await this.itemRepository.updateStatus(
        itemId,
        !item.active,
      );

      if (updatedItem && updatedItem.productId) {
        this.productRepository.syncProductStaticFields(null, updatedItem.productId).catch(err => console.error("Sync error:", err));
      }

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

  async editItem(itemId, payload, files = []) {
    try {
      const item = await this.itemRepository.findById(itemId);

      if (!item) {
        throw new Error("Item not found");
      }

      let currentCerts = payload.diacertificate || [];
      if (!Array.isArray(currentCerts)) currentCerts = currentCerts ? [currentCerts] : [];

      if (files && files.length > 0) {
        const s3configs = await s3Helper();
        const certFiles = files.filter(f => f.fieldname === "diaCertificateFile" || f.fieldname === "diaCertificateFile[]");
        if (certFiles.length > 0) {
          const uploadedNames = await Promise.all(
            certFiles.map(file => s3Service.uploadToS3(file, "certificates", s3configs))
          );
          currentCerts = [...currentCerts, ...uploadedNames];
        }
      }
      payload.diacertificate = currentCerts;

      // if (item.status === 2) {
      //   throw new Error(
      //     "This item has already been sold and cannot be modified.",
      //   );
      // }

      const forbiddenFields = [
        "productId",
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
            ...(payload.stoneData || []).map((s) => {
              const stoneCopy = { ...s, type: "stone" };
              delete stoneCopy._id;
              return stoneCopy;
            }),
            ...(payload.diamondData || []).map((d) => {
              const diamondCopy = { ...d, type: "diamond" };
              delete diamondCopy._id;
              return diamondCopy;
            }),
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

      if (updatedItem && updatedItem.productId) {
        this.productRepository.syncProductStaticFields(null, updatedItem.productId).catch(err => console.error("Sync error:", err));
      }

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
    let actualMakingValue = 0;
    const mc = item.makingCharges || {};
    const makingAmount = Number(mc.makingDiscountedValue || 0);
    const actualMakingAmount = Number(mc.makingActualValue || 0);
    const makingWeightBase = Number(mc.calculationType) === 1 ? grossWt : netWt;

    if (Number(mc.makingMode) === 1) {
      makingValue = makingAmount;
      actualMakingValue = actualMakingAmount;
    } else if (Number(mc.makingMode) === 2) {
      makingValue = makingWeightBase * makingAmount;
      actualMakingValue = makingWeightBase * actualMakingAmount;
    }

    let wastageValue = 0;
    let actualWastageValue = 0;
    const wc = item.wastageCharges || {};
    const wastageAmount = Number(wc.wastageDiscountedValue || 0);
    const actualWastageAmount = Number(wc.wastageActualValue || 0);
    const wastageWeightBase = Number(wc.calculationType) === 1 ? grossWt : netWt;

    if (Number(wc.wastageMode) === 1) {
      wastageValue = wastageAmount;
      actualWastageValue = actualWastageAmount;
    } else if (Number(wc.wastageMode) === 2) {
      wastageValue = (wastageAmount / 100) * rate * wastageWeightBase;
      actualWastageValue = (actualWastageAmount / 100) * rate * wastageWeightBase;
    }

    let stoneValue = 0;
    let totalDiamondWeight = 0, totalDiamondCost = 0, totalDiamondPrice = 0, totalDiamondCount = 0;
    let totalStoneWeight = 0, totalStoneCost = 0, totalStonePrice = 0, totalStoneCount = 0;
    let stoneDiamondDetails = [];

    if (item.stoneDetails && Array.isArray(item.stoneDetails)) {
      item.stoneDetails.forEach(stone => {
        let price = Number(stone.price || 0);
        if (price === 0 && stone.itemId && stone.itemId.percraterate) {
          price = Number(stone.weight || 0) * Number(stone.itemId.percraterate || 0) + Number(stone.itemId.charge || 0);
        }
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

        if (stone.type && stone.type.toLowerCase() === "diamond") {
          totalDiamondWeight += Number(stone.weight || 0);
          totalDiamondCost += Number(stone.cost || 0);
          totalDiamondPrice += price;
          totalDiamondCount += 1;
        } else if (stone.type && stone.type.toLowerCase() === "stone") {
          totalStoneWeight += Number(stone.weight || 0);
          totalStoneCost += Number(stone.cost || 0);
          totalStonePrice += price;
          totalStoneCount += 1;
        }
      });
    }

    const huid = Number(item.huidCharges || 0);
    const gstPct = Number(item.gst || 3);

    const subTotal = metalValue + makingValue + wastageValue + stoneValue + huid;
    const gstValue = (subTotal * gstPct) / 100;
    const outprice = subTotal + gstValue;

    const actualSubTotal = metalValue + actualMakingValue + actualWastageValue + stoneValue + huid;
    const actualGstValue = (actualSubTotal * gstPct) / 100;
    const totalPrice = actualSubTotal + actualGstValue;

    return {
      price: Number(subTotal.toFixed(2)),
      totalprice: Number(outprice.toFixed(2)),
      actualTotalPrice: Number(totalPrice.toFixed(2)),
      metalValue,
      makingValue,
      wastageValue,
      gstValue,
      stoneValue,
      huidCharges: huid,
      subtotal: subTotal,
      stoneDiamondDetails,
      totalDiamondWeight,
      totalDiamondCost,
      totalDiamondPrice,
      totalDiamondCount,
      totalStoneWeight,
      totalStoneCost,
      totalStonePrice,
      totalStoneCount,
      finalMakingCharge: makingValue,
      finalWastageCharge: wastageValue,
    };
  }
}

export default ItemUseCase;
