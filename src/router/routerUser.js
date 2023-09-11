import express from 'express'
import {
  getActiveUsers,
  getInactiveUsers,
  getOfflineUsers,
  getOnlineUsers,
  getUserById,
} from '../controllers/userController'

const routerUser = express.Router()

// Endpoint para administrar usuarios
routerUser.use('/user', [
  express.Router().get('/actives', getActiveUsers),
  express.Router().get('/inactives', getInactiveUsers),
  express.Router().get('/onlines', getOnlineUsers),
  express.Router().get('/offlines', getOfflineUsers),
  express.Router().get('/:id', getUserById),
])

export default routerUser
