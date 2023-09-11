import express from 'express'
import {
  authenticate,
  deleteAccount,
  login,
  logout,
  register,
} from '../controllers/authController.js'
import {
  hashPassword,
  verifiyPassword,
  validateUserDataLogin,
  validateUserDataRegister,
  verifyUserExists,
  generateToken,
  verifyUserAlreadyExists,
  passportJwtAuthentication,
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
  express.Router().post(
    '/authenticate', // Refrezca el token si el usuario está online
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    generateToken,
    authenticate
  ),
  express
    .Router()
    .post(
      '/logout',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      logout
    ),
  express
    .Router()
    .post(
      '/delete-account',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteAccount
    ),
])

export default routerAuth
