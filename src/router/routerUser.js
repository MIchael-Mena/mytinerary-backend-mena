import express from 'express'
import { createUser, getUser } from '../controllers/userController.js'
import validateId from '../middleware/validateId.js'

const routerUser = express.Router()

routerUser.use('/user', [
  express.Router().post('/create', createUser),
  express.Router().get('/:id', validateId, getUser),
])

export default routerUser
