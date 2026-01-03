import Joi from "joi";

const updateApplicationSchema = Joi.object({
  body: Joi.object({
    application_status: Joi.string().valid("Pending", "Approved", "Rejected").required(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

export default updateApplicationSchema;
