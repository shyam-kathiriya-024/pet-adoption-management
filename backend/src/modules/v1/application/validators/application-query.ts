import Joi from "joi";

const applicationQuerySchema = Joi.object({
  query: Joi.object({
    user_id: Joi.string().optional(),
    pet_id: Joi.string().optional(),
    application_status: Joi.string().valid("Pending", "Approved", "Rejected").optional(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),
});

export default applicationQuerySchema;
