// Necesario si se cambia de carpeta el archivo .env, pero hay que hacerlo en todos los archivos que lo usen
// import dotenv from 'dotenv'
// dotenv.config({ path: 'src/.env' })

import 'dotenv/config.js'
import express from 'express'
import router from './router/router.js'
import './config/database.js'

const app = express()

app.use(express.json())

app.use('/api', router) // primer parametro es opcional

app.listen(process.env.PORT, () => {
  console.log('Server is up on port ' + process.env.PORT)
})
