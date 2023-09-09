import Joi from 'joi'
import jsonResponse from '../../utils/jsonResponse.js'
import JoiDate from '@joi/date'

const JoiWithDate = Joi.extend(JoiDate)

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().min(6).max(20).required().messages({
    'string.email': 'Email must be a valid email',
    'string.min': 'Email must be at least 4 characters long',
    'string.max': 'Email must be at most 20 characters long',
    'string.empty': 'Email is a required field',
    'any.required': 'Email is a required field',
  }),
  password: Joi.string().alphanum().min(6).max(20).required().messages({
    'string.alphanum': 'Password must be alphanumeric',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 20 characters long',
    'string.empty': 'Password is a required field',
    'any.required': 'Password is a required field',
  }),
})

const userDetailSchema = userLoginSchema.keys({
  // Incluye las validaciones de userLoginSchema
  name: Joi.string().required().messages({
    'string.empty': 'Name is a required field',
    'any.required': 'Name is a required field',
  }),
  surname: Joi.string().required().messages({
    'string.empty': 'Surname is a required field',
    'any.required': 'Surname is a required field',
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country is a required field',
    'any.required': 'Country is a required field',
  }),
  birthDate: JoiWithDate.date().format('YYYY-MM-DD').required().messages({
    'date.format': 'Birth date must be in format YYYY-MM-DD',
    'date.base': 'Birth date must be a valid date',
    'any.required': 'Birth date is a required field',
  }),
  role: Joi.string().valid('admin', 'user').default('user').messages({
    'any.only': 'Role must be admin or user',
  }),
  active: Joi.boolean().default(true).messages({
    'any.only': 'Active must be true or false',
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

const validateUserRegister = async (req, res, next) => {
  const payload = req.body
  const userValidation = userDetailSchema.validate(payload, {
    abortEarly: false,
    dateFormat: 'date',
    stripUnknown: true,
  })

  if (userValidation.error) {
    return jsonResponse(
      false,
      res,
      400,
      userValidation.error.details.map((error) => error.message)
    )
  }
  next()
}
const validateUserLogin = async (req, res, next) => {
  const payload = req.body
  const userValidation = userLoginSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  })
  if (userValidation.error) {
    return jsonResponse(
      false,
      res,
      400,
      userValidation.error.details.map((error) => error.message)
    )
  }
  next()
}

export { validateUserRegister, validateUserLogin }
