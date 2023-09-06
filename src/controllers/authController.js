import { verifiyPassword } from '../middleware/auth.js'
import jsonResponse from '../utils/jsonResponse.js'

const { default: User } = require('../models/User')

const register = async (req, res, next) => {
  try {
    const payload = req.body
    const useExists = await User.findOne({ email: payload.email })
    if (useExists) {
      jsonResponse(false, res, 403, 'User already exists')
    }
    const user = new User(payload)
    await user.save()
    jsonResponse(true, res, 201, 'User created')
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const userFounded = await User.findOne({ email })
    if (!userFounded) {
      if (verifiyPassword(password, userFounded.password)) {
        jsonResponse(true, res, 200, 'User logged')
      } else {
        jsonResponse(false, res, 400, 'User not found')
      }
    }
  } catch (error) {
    next(error)
  }
}

export { register, login }
