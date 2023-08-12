import express from 'express'
import { getUser, createUser } from '../controllers/userController.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/user/:id', getUser)
router.post('/user/create', createUser)

export default router
