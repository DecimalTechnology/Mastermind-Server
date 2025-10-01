import Joi from "joi";

// Create Joi schema for validation
export const discountValidator = Joi.object({
  restaurantName: Joi.string().trim().min(2).max(100).required(),
  discountPercentage: Joi.number().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  isActive: Joi.boolean().optional(),
  image: Joi.string().uri().optional(), // you can remove `.uri()` if not always a URL
  QRCode: Joi.string().optional(), // maybe later you validate as base64/uuid
});
