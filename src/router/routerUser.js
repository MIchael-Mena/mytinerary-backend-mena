import express from 'express'
import {
  createUser,
  getUser,
  getUserDetail,
} from '../controllers/userController.js'

const routerUser = express.Router()

routerUser.use('/user', [
  express.Router().post('/create', createUser),
  express.Router().get('/:id', getUser),
  express.Router().get('/detail/:id', getUserDetail),
])

export default routerUser
