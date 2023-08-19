import express from 'express'
import { getUser, createUser } from '../controllers/userController.js'
import { addAccount } from '../controllers/accountsController.js'

const router = express.Router()

router.get('/saludo/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.query
  res.send(`Hola ${name} tu id es ${id}`)
})

router.get('/user/:id', getUser)
router.post('/user/create', createUser)
router.post('/account/create', addAccount)

export default router
