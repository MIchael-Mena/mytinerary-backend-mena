import express from 'express'
import { login, register } from '../controllers/authController.js'
import {
  hashPassword,
  verifiyPassword,
  validateUserDataLogin,
  validateUserDataRegister,
  verifyUserExists,
  generateToken,
  verifyUserAlreadyExists,
} from '../middleware/auth.js'

const routerAuth = express.Router()

routerAuth.use('/user', [
  express
    .Router()
    .post(
      '/register',
      validateUserDataRegister,
      verifyUserAlreadyExists,
      hashPassword,
      register
    ),
  express
    .Router()
    .post(
      '/login',
      validateUserDataLogin,
      verifyUserExists,
      verifiyPassword,
      generateToken,
      login
    ),
])

export default routerAuth
