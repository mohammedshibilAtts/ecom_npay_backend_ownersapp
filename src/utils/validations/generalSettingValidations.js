import Joi from 'joi';

class generalSettingValidator {
    generalSettingValidator = Joi.object({
    id_branch: Joi.string()
      .trim()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "any.required": "Branch ID is required",
        "string.empty": "Branch ID cannot be empty",
        "string.base": "Branch ID must be a string",
        "string.pattern.base": "Branch ID must be a valid MongoDB ObjectId",
      }),
  });
}

export default generalSettingValidator;