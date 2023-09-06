import Joi from 'joi'
import jsonResponse from '../utils/jsonResponse.js'

const userSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().email().min(4).max(20).required(),
  password: Joi.string().alphanum().min(6).required().messages({
    'string.alphanum': 'Password must be alphanumeric',
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is a required field',
    'any.required': 'Password is a required field',
  }),
})

const verifyUserData = async (req, res, next) => {
  const payload = req.body
  const userValidation = userSchema.validate(payload, { abortEarly: false })
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

export { verifyUserData }
