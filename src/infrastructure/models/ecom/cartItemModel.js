import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const CartItemSchema = new Schema(
  {
    cartId: { type: Types.ObjectId, ref: "Cart", required: true, index: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    itemId: { type: Types.ObjectId, ref: "Item", required: true },
    // variantId: { type: Types.ObjectId, ref: "Variant" },
    collectionId: { type: Types.ObjectId, ref: "Collection", default: null },
    sizeId: {
      type: String,
      required: false,
    },
    categoryId: { type: Types.ObjectId, ref: "Category" },
    subCategoryId: { type: Types.ObjectId, ref: "SubCategory" },
    productName: { type: String, required: true },
    sku: { type: String },
    image: { type: String },
    quantity: { type: Number, min: 1, default: 1 },
    id_metal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metal",
      required: true,
    },
    metalWeight: { type: Number },

    id_purity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purity",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CartItemSchema.index({ cartId: 1, productId: 1, variantId: 1 });

const CartItem = mongoose.model("CartItem", CartItemSchema);
export default CartItem;
