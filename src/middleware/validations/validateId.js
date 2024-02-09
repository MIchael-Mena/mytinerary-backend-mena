import { Types } from 'mongoose'
import jsonResponse from '../../utils/jsonResponse.js'

const validateId = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return jsonResponse(false, res, 404, `Id not valid.`)
  }
  next()
}

export default validateId
