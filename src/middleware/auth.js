import bcrypt from 'bcrypt'
import jsonResponse from '../utils/jsonResponse.js'

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

const verifiyPassword = (passwordPlain, hashPassword) => {
  return bcrypt.compareSync(passwordPlain, hashPassword)
}

export { hashPassword, verifiyPassword }
