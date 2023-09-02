import { Types } from 'mongoose'
import jsonResponse from '../utils/jsonResponse.js'

const validateId = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    const currentRoute = req.originalUrl.split('/')[2]
    const capitalizedRoute =
      currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)

    return jsonResponse(false, res, 404, `${capitalizedRoute} not found.`)
  }
  next()
}

export default validateId
