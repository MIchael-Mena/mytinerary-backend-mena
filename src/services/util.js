import { Types } from 'mongoose'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'

const validateId = (id, schemaName) => {
  if (!Types.ObjectId.isValid(id)) {
    // throw new InvalidFieldError(`${schemaName} with id '${id}' not found.`)
    throw new InvalidFieldError(`Invalid ${schemaName} id '${id}'.`)
  }
}

export { validateId }
