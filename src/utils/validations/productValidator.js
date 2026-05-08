import Joi from "joi";

class ProductValidator {
  productValidations = Joi.object({
    product_name: Joi.string().trim().required().messages({
      "any.required": "Product Name is required",
      "string.base": "Product Name must be a string",
      "string.empty": "Product Name cannot be empty",
    }),

    code: Joi.string().trim().required().messages({
      "any.required": "Code is required",
      "string.base": "Code must be a string",
      "string.empty": "Code cannot be empty",
    }),

    id_category: Joi.string().trim().required().messages({
      "any.required": "Category ID is required",
      "string.base": "Category ID must be a string",
    }),

    subcategoryId: Joi.string().trim().required().messages({
      "any.required": "Subcategory is required",
      "string.base": "Subcategory must be a string",
    }),

    id_metal: Joi.string().required().messages({
      "any.required": "Metal ID is required",
      "string.base": "Metal ID must be a string",
    }),

    id_branch: Joi.string().trim().required().messages({
      "any.required": "Branch ID is required",
      "string.base": "Branch ID must be a string",
    }),

    gst: Joi.number().min(0).required().messages({
      "any.required": "GST is required",
      "number.base": "GST must be a number",
      "number.min": "GST cannot be negative",
    }),

    description: Joi.string().trim().optional().allow(null, "").messages({
      "string.base": "Description must be a string",
    }),

    showprice: Joi.boolean().required().messages({
      "any.required": "Show price type is required",
      "boolean.base": "Show price must be boolean",
    }),

    product_image: Joi.array()
      .items(
        Joi.string().trim().messages({
          "string.base": "Each product image must be a string",
          "string.empty": "Product image cannot be empty",
        }),
      )
      .optional()
      .messages({
        "array.base": "Product Image must be an array of strings",
      }),

    sku: Joi.string().trim().optional().allow(null, "").messages({
      "string.base": "SKU must be a string",
    }),

    bestSeller: Joi.boolean().optional().messages({
      "boolean.base": "BestSeller must be boolean",
    }),

    onlineProduct: Joi.boolean().optional().messages({
      "boolean.base": "onlineProduct must be boolean",
    }),

    active: Joi.boolean().optional().messages({
      "boolean.base": "active must be boolean",
    }),
  });
}

export default ProductValidator;
