import Joi from "joi";

const petQuerySchema = Joi.object({
  query: Joi.object({
    search: Joi.string().trim().optional(),
    species: Joi.string().valid("Dog", "Cat", "Other", "All").optional(),
    breed: Joi.string().trim().optional(),
    minAge: Joi.number().min(0).optional(),
    maxAge: Joi.number().min(0).optional(),
    status: Joi.string().valid("Available", "Pending", "Adopted").optional(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),
});

export default petQuerySchema;
