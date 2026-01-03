import Joi from "joi";

const insertApplicationSchema = Joi.object({
  body: Joi.object({
    pet_id: Joi.string().required(),
    user_id: Joi.string().required(),
    user_name: Joi.string().trim().required(),
    application_message: Joi.string().trim().required(),
  }),
});

export default insertApplicationSchema;
