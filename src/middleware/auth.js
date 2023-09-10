import bcrypt from 'bcrypt'
import jsonResponse from '../utils/jsonResponse.js'
import User from '../models/User.js'
import { userDetailSchema, userLoginSchema } from '../models/UserValidation.js'
import jbt from 'jsonwebtoken'

const validateUserDataRegister = async (req, res, next) => {
  const payload = req.body
  const userValidation = userDetailSchema.validate(payload, {
    abortEarly: false,
    dateFormat: 'date',
  })

  if (userValidation.error)
    return jsonResponse(
      false,
      res,
      400,
      userValidation.error.details.map((error) => error.message)
    )

  // Reemplazo el body por el validado que incluye los valores por defecto
  req.body = userValidation.value

  next()
}

const validateUserDataLogin = async (req, res, next) => {
  const payload = req.body
  const userValidation = userLoginSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  })
  if (userValidation.error)
    return jsonResponse(
      false,
      res,
      400,
      userValidation.error.details.map((error) => error.message)
    )

  next()
}

const hashPassword = (req, res, next) => {
  try {
    const passwordPlain = req.body.password
    const hashPassword = bcrypt.hashSync(passwordPlain, 10)

    req.body.password = hashPassword
    next()
  } catch (error) {
    jsonResponse(false, res, 500, 'Error hashing password')
  }
}

const verifyUserAlreadyExists = async (req, res, next) => {
  const { email } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) return jsonResponse(false, res, 403, 'User already exists')

  next()
}

const verifyUserExists = async (req, res, next) => {
  const { email } = req.body
  const userExist = await User.findOne({ email })
  if (!userExist) return jsonResponse(false, res, 404, 'User not found')

  req.user = userExist
  next()
}

const verifiyPassword = (req, res, next) => {
  const passwordPlain = req.body.password
  const hashPassword = req.user.password
  const isPasswordValid = bcrypt.compareSync(passwordPlain, hashPassword)

  if (!isPasswordValid)
    return jsonResponse(false, res, 400, 'Password not valid')

  next()
}

const generateToken = (req, res, next) => {
  const token = jbt.sign({ email: req.body.email }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  })
  req.token = token
  next()
}

export {
  hashPassword,
  verifiyPassword,
  validateUserDataRegister,
  validateUserDataLogin,
  verifyUserExists,
  generateToken,
  verifyUserAlreadyExists,
}
