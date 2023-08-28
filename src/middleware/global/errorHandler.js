import jsonResponse from '../../utils/jsonResponse.js'

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    // Fallo de validación en mongoose
    return jsonResponse(false, res, 400, error.message, error.errors)
  } else {
    return jsonResponse(false, res, 500, error.message)
  }
}

export default errorHandler
