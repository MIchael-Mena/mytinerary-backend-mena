import express from 'express'
import { getUserDetail } from '../controllers/userController.js'

const routerUser = express.Router()

// Router para User en el que solo se mostrará información pública

routerUser.use('/user', [express.Router().get('/detail/:id', getUserDetail)])

export default routerUser
