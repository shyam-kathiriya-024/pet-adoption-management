import Joi from "joi";

const registerSchema = Joi.object({
  body: Joi.object({
    user_name: Joi.string().trim().min(2).max(100).required(),
    user_email: Joi.string().email().trim().required(),
    user_password: Joi.string().min(6).max(100).required(),
  }),
});

export default registerSchema;
