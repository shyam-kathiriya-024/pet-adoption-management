import Joi from "joi";

const loginSchema = Joi.object({
  body: Joi.object({
    user_email: Joi.string().email().trim().required(),
    user_password: Joi.string().required(),
  }),
});

export default loginSchema;
