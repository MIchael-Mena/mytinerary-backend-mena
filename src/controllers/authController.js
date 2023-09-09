import { verifiyPassword } from '../middleware/auth.js'
import User from '../models/User.js'
import jsonResponse from '../utils/jsonResponse.js'

const register = async (req, res, next) => {
  try {
    const payload = req.body
    const useExists = await User.findOne({ email: payload.email })
    if (useExists) {
      return jsonResponse(false, res, 403, 'User already exists')
    }
    const user = new User(payload)
    await user.save()
    const { password, ...response } = user.toObject()
    jsonResponse(true, res, 201, 'User created', response)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const userFounded = await User.findOne({ email })
    if (!userFounded) {
      return jsonResponse(false, res, 400, 'User not found')
    }
    if (!verifiyPassword(password, userFounded.password)) {
      return jsonResponse(false, res, 400, 'Password not valid')
    }

    jsonResponse(true, res, 200, 'User logged')
  } catch (error) {
    next(error)
  }
}

export { register, login }
