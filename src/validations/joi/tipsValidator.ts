import Joi from "joi";

export const createTipsValidator = Joi.object({
  title: Joi.string().required(),
  userId: Joi.string().required(), // should be ObjectId string
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()).optional(), // array of URLs
  videos: Joi.array().items(Joi.string().uri()).optional(),
  isActive: Joi.boolean().optional(),
  likes: Joi.array().items(Joi.string().hex().length(24)).optional(), // array of user IDs
  dislikes: Joi.array().items(Joi.string().hex().length(24)).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const updateTipsValidator = Joi.object({
  title: Joi.string().optional(),
  userId: Joi.string().optional(),
  description: Joi.string().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  videos: Joi.array().items(Joi.string().uri()).optional(),
  isActive: Joi.boolean().optional(),
  likes: Joi.array().items(Joi.string().hex().length(24)).optional(),
  dislikes: Joi.array().items(Joi.string().hex().length(24)).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});
