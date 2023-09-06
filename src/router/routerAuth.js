import express from 'express'
import { login, register } from '../controllers/authController.js'
import { verifyUserData } from '../middleware/verifications.js'
import { hashPassword } from '../middleware/auth.js'

const routerUser = express.Router()

routerUser.use('/user', [
  express.Router().post('/register', verifyUserData, hashPassword, register),
  express.Router().post('/login', verifyUserData, login),
])

export default routerUser
