import express from 'express'
import { login, register } from '../controllers/authController.js'
import { hashPassword } from '../middleware/auth.js'
import {
  validateUserLogin,
  validateUserRegister,
} from '../middleware/user/validateUser.js'

const routerAuth = express.Router()

routerAuth.use('/user', [
  express
    .Router()
    .post('/register', validateUserRegister, hashPassword, register),
  express.Router().post('/login', validateUserLogin, login),
])

export default routerAuth
