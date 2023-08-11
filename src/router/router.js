const express = require('express')
const router = express.Router()
const { getClient } = require('../controllers/clientController')

router.get('/client/:id', getClient)

// router.get('/clients', (req, res) => {
//   res.send('Hello World!')
// })

module.exports = router
