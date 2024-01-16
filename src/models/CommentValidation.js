import Joi from 'joi'

const commentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500).required().messages({
    'string.min': 'Comment must be at least 1 characters long',
    'string.max': 'Comment must be at most 500 characters long',
    'string.empty': 'Comment is a required field',
    'any.required': 'Comment is a required field',
  }),
  onModel: Joi.string().trim().valid('Itinerary').messages({
    'any.only': 'onModel must be Itinerary or Activity',
    'string.empty': 'onModel is a required field',
    'any.required': 'onModel is a required field',
  }),
  _reference: Joi.string().trim().messages({
    'string.empty': 'Reference is a required field',
    'any.required': 'Reference is a required field',
  }),
  _user: Joi.string().trim().messages({
    'string.empty': 'User is a required field',
    'any.required': 'User is a required field',
  }),
  // No agrego los demas campos ya que se estan validando en el servicio
})

export { commentSchema }
