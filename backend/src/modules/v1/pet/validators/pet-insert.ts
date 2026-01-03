import Joi from "joi";

const insertPetSchema = Joi.object({
  body: Joi.object({
    pet_name: Joi.string().trim().required(),
    pet_species: Joi.string().valid("Dog", "Cat", "Other").required(),
    pet_breed: Joi.string().trim().required(),
    pet_age: Joi.number().min(0).max(30).required(),
    pet_gender: Joi.string().valid("Male", "Female").required(),
    pet_size: Joi.string().valid("Small", "Medium", "Large").required(),
    pet_description: Joi.string().trim().required(),
    pet_image_url: Joi.string().uri().trim().required(),
    pet_status: Joi.string().valid("Available", "Pending", "Adopted").default("Available"),
    pet_location: Joi.string().trim().required(),
  }),
});

export default insertPetSchema;
