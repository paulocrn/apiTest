const Joi = require('@hapi/joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
    apellido: Joi.string().min(3).optional(),
    cedula: Joi.string().min(10).max(13).optional(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(10).optional(),
    direccion: Joi.string().allow(null, '').default(""),
    estado: Joi.number().empty("").default(1),
    profilePicture: Joi.string().allow(null, '').default(""),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
  });
  //console.log(schema.validate(data));
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required(),
    pushTokens: Joi.array(),
  });
  return schema.validate(data);
};
const editUserValidation = (data) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
    apellido: Joi.string().min(3),
    cedula: Joi.string().min(10).max(13).messages({
      'string.min': 'Cédula debe contener al menos 10 dígitos',
    }),
    email: Joi.string().min(6).required().email().messages({
      'any.required': 'Email es un campo requerido',
    }),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(10),
    direccion: Joi.string().allow(null, '').default(""),
    profilePicture: Joi.string().allow(null, '').default("")
  });
  //console.log(schema.validate(data));
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.editUserValidation = editUserValidation;
