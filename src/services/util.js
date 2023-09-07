import { Types } from 'mongoose'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'

const validateId = (id) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidFieldError('Id not valid.', 400)
  }
}

export { validateId }
