import Joi from 'joi'
import JoiDate from '@joi/date'

const JoiWithDate = Joi.extend(JoiDate)

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().min(4).max(50).required().messages({
    'string.email': 'Email must be a valid email',
    'string.min': 'Email must be at least 4 characters long',
    'string.max': 'Email must be at most 20 characters long',
    'string.empty': 'Email is a required field',
    'any.required': 'Email is a required field',
  }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$'))
    .min(6)
    .max(20)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one numeric character, one lowercase letter, and one uppercase letter',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must be at most 20 characters long',
      'string.empty': 'Password is a required field',
      'any.required': 'Password is a required field',
    }),
})

const userDetailSchema = userLoginSchema.keys({
  // Incluye las validaciones de userLoginSchema
  firstName: Joi.string().trim().min(4).max(20).required().messages({
    'string.max': 'Name must be at most 20 characters long',
    'string.empty': 'Name is a required field',
    'any.required': 'Name is a required field',
  }),
  lastName: Joi.string().trim().max(20).required().messages({
    'string.max': 'Surname must be at most 20 characters long',
    'string.empty': 'Surname is a required field',
    'any.required': 'Surname is a required field',
  }),
  country: Joi.string().max(20).default(null).messages({
    'string.max': 'Country must be at most 20 characters long',
    'string.empty': 'Country is a required field',
    'any.required': 'Country is a required field',
  }),
  birthDate: JoiWithDate.date().format('YYYY-MM-DD').default(null).messages({
    'date.format': 'Birth date must be in format YYYY-MM-DD',
    'date.base': 'Birth date must be a valid date',
    'any.required': 'Birth date is a required field',
  }),
  profilePic: Joi.string().default('').messages({
    'any.only': 'Profile pic must be a string',
  }),
  role: Joi.string().valid('admin', 'user').default('user').messages({
    'any.only': 'Role must be admin or user',
  }),
  active: Joi.boolean().default(true).messages({
    'any.only': 'Active must be true or false',
  }),
  online: Joi.boolean().default(false).messages({
    'any.only': 'Online must be true or false',
  }),
  lastLogin: JoiWithDate.date().format('YYYY-MM-DD').default(null).messages({
    'date.format': 'Last login must be in format YYYY-MM-DD',
    'date.base': 'Last login must be a valid date',
  }),
  favouriteCities: Joi.array().items(Joi.string()).default([]).messages({
    'any.only': 'Favourite cities must be an array of strings',
  }),
  favouriteActivities: Joi.array().items(Joi.string()).default([]).messages({
    'any.only': 'Favourite activities must be an array of strings',
  }),
  favouriteItineraries: Joi.array().items(Joi.string()).default([]).messages({
    'any.only': 'Favourite itineraries must be an array of strings',
  }),
})

export { userLoginSchema, userDetailSchema }
