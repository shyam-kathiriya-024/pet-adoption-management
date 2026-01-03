import Joi from "joi";

const petIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

export default petIdSchema;
