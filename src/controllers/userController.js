import { getUserDetailService } from '../services/userService.js'
import jsonResponse from '../utils/jsonResponse.js'

const getUserDetail = async (req, res, next) => {
  try {
    const user = await getUserDetailService(req.params.id)

    jsonResponse(true, res, 200, 'User found', user)
  } catch (error) {
    next(error)
  }
}

export { getUserDetail }
