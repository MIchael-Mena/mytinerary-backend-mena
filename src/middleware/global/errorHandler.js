import { InvalidFieldError } from '../../exceptions/InvalidFieldError.js'
import { NotFoundError } from '../../exceptions/NotFoundError.js'
import jsonResponse from '../../utils/jsonResponse.js'

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    // Fallo de validación en mongoose
    return jsonResponse(false, res, 400, error.message, error.errors)
  } else if (
    error instanceof NotFoundError ||
    error instanceof InvalidFieldError
  ) {
    return jsonResponse(false, res, error.status, error.message)
  } else {
    return jsonResponse(false, res, 500, error.message)
  }
}

export default errorHandler
