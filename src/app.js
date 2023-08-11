const express = require('express')
const router = require('./router/router')

const app = express()

app.use('/api', router) // primer parametro es opcional

app.listen(3000, () => {
  console.log('Server is up on port 3000')
})
