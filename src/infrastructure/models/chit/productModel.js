// import mongoose from "mongoose";
// import { Schema } from "mongoose";

// const chargeSchema = new mongoose.Schema({
//   mode: {
//     type: Number, // 1- amount , 2- amount
//     required: false,
//   },
//   actualValue: {
//     type: Number,
//     required: false,
//   },
//   discountedValue: {
//     type: Number,
//     default: null,
//   },
//   discountedPercentage: {
//     type: Number,
//     default: null,
//   },
//   discountView: {
//     type: Boolean,
//     required: false,
//   },
//   mcView: {
//     type: Boolean,
//   },
//   wastageView: {
//     type: Boolean,
//   },
// });

// const productSchema = new mongoose.Schema(
//   {
//     id_category: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Category",
//     },
//     id_branch: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Branch",
//     },
//     product_name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       default: null,
//     },
//     code: {
//       type: String,
//       required: true,
//     },
//     id_metal: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Metal",
//       required: true,
//     },
//     // weight: {
//     //   type: Number,
//     //   default: null,
//     // },
//     grossWt: {
//       type: Number,  // added in favour of new ecom implimentation
//       default: null,
//     },
//     id_purity: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Purity",
//       required: true,
//     },
//     gst: {
//       type: Number,
//       required: true,
//     },
//     product_image: {
//       type: [String],
//       default: null,
//     },
//     showprice: {
//       type: Boolean,
//       default: false,
//       default: true,
//     },
//     makingCharges: {
//       type: chargeSchema,
//       required: false,
//     },
//     wastageCharges: {
//       type: chargeSchema,
//       required: false,
//     },
//     active: {
//       type: Boolean,
//       default: true,
//     },
//     onlineProduct: {
//       type: Boolean,
//       default: true,
//     },
//     is_deleted: {
//       type: Boolean,
//       default: false,
//     },
//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Employee",
//     },
//     modified_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Employee",
//     },
//     collection: {
//       type: [Schema.Types.ObjectId],
//       default: [],
//       validate: {
//         validator: function (array) {
//           return array.every((item) => mongoose.Types.ObjectId.isValid(item));
//         },
//         message: "All items must be valid ObjectIds",
//       },
//     },
//     quantity: {
//       type: Number,
//       default: 0,
//     },
//     availableSizes: {
//       sizeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "SizeMaster",
//         required: true,
//       },
//       values: [
//         {
//           sizeValue: {
//             type: Number,
//             required: true,
//           },
//           quantity: {
//             type: Number,
//             required: false,
//             default: 0,
//           },
//         },
//       ],
//     },
//     // categoryId: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   required: true,
//     //   ref: "Category",
//     // },
//     subcategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "SubCategory",
//     },
//     sku:{
//       type:String,
//       default:null
//     },
//     netWeight:{
//       type:Number
//     },
//     stoneDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "StoneDetails" }],
//     bestSeller:{
//       type:Boolean,
//       default:false
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";
import { Schema } from "mongoose";

// ===== PRODUCT = PURE DESIGN MASTER =====

const productSchema = new mongoose.Schema(
  {
    id_category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },

    id_branch: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Branch",
    },

    product_name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: null,
    },

    // Unique design code
    code: {
      type: String,
      required: true,
      unique: true,
    },

    id_metal: {
      type: Schema.Types.ObjectId,
      ref: "Metal",
      required: true,
    },

    gst: {
      type: Number,
      required: true,
      default: 3,
    },

    product_image: {
      type: [String],
      default: [],
    },

    showprice: {
      type: Boolean,
      default: true,
    },

    isMrp: {
      type: Boolean,
      default: false,
    },

    subcategoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SizeMaster",
      required: true,
    },
    sku: {
      type: String,
      default: null,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    // ===== SYSTEM FIELDS =====

    active: {
      type: Boolean,
      default: true,
    },

    onlineProduct: {
      type: Boolean,
      default: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },

    modified_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },

    collection: {
      type: [Schema.Types.ObjectId],
      default: [],
      validate: {
        validator: function (array) {
          return array.every((item) => mongoose.Types.ObjectId.isValid(item));
        },
        message: "All items must be valid ObjectIds",
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
