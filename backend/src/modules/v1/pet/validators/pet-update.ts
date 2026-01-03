import Joi from "joi";

const updatePetSchema = Joi.object({
  body: Joi.object({
    pet_name: Joi.string().trim().optional(),
    pet_species: Joi.string().valid("Dog", "Cat", "Other").optional(),
    pet_breed: Joi.string().trim().optional(),
    pet_age: Joi.number().min(0).max(30).optional(),
    pet_gender: Joi.string().valid("Male", "Female").optional(),
    pet_size: Joi.string().valid("Small", "Medium", "Large").optional(),
    pet_description: Joi.string().trim().optional(),
    pet_image_url: Joi.string().uri().trim().optional(),
    pet_status: Joi.string().valid("Available", "Pending", "Adopted").optional(),
    pet_location: Joi.string().trim().optional(),
    pet_archived: Joi.boolean().optional(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

export default updatePetSchema;
