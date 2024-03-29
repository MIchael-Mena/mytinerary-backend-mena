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
  checkUserExists,
  generateToken,
  checkEmailDuplicate,
  passportJwtAuthentication,
} from '../middleware/auth.js'
import {
  generateBasicUser,
  validateGoogleAuthCode,
} from '../middleware/authGoogle.js'

const routerAuth = express.Router()

routerAuth.use('/auth', [
  express.Router().post(
    '/register',
    validateUserDataRegister,
    checkEmailDuplicate,
    hashPassword,
    generateToken, // Lo ideal seria validar el email antes de generar el token en el registro
    register
  ),
  express
    .Router()
    .post(
      '/login',
      validateUserDataLogin,
      checkUserExists,
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
  // No es necesario loguout con JWT, ya que no se mantiene estado en el servidor
  /*   express
    .Router()
    .post(
      '/logout',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      logout
    ), */
  express
    .Router()
    .post(
      '/delete-account',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteAccount
    ),
  express
    .Router()
    .post(
      '/register-google',
      validateGoogleAuthCode,
      checkEmailDuplicate,
      generateBasicUser,
      hashPassword,
      generateToken,
      register
    ),
  express
    .Router()
    .post(
      '/login-google',
      validateGoogleAuthCode,
      checkUserExists,
      generateToken,
      login
    ),
])

export default routerAuth
