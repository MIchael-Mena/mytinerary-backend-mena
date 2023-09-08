import express from 'express'
import { createUser, getUser } from '../controllers/userController.js'

const routerUser = express.Router()

routerUser.use('/user', [
  express.Router().post('/create', createUser),
  express.Router().get('/:id', getUser),
])

export default routerUser
