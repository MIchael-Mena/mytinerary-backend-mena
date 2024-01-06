// Necesario si se cambia de carpeta el archivo .env, pero hay que hacerlo en todos los archivos que lo usen
// import dotenv from "dotenv"
// dotenv.config({ path: "src/.env" })

import 'dotenv/config.js'
import express from 'express'
import './config/database.js'
import errorHandler from './middleware/global/errorHandler.js'
import notFoundHandler from './middleware/global/notFoundHandler.js'
import routerCity from './router/routerCity.js'
import routerItinerary from './router/routerItinerary.js'
import cors from 'cors'
import routerAuth from './router/routerAuth.js'
import routerActivity from './router/routerActivity.js'
import routerComment from './router/routerComment.js'

const app = express()

app.use(cors())
app.use(express.json()) // para que express entienda el formato json

app.use('/api', [
  routerCity,
  routerItinerary,
  routerAuth,
  routerActivity,
  routerComment,
])

app.use(errorHandler)
app.use(notFoundHandler)

app.listen(process.env.PORT, () => {
  console.log('Server is up on port ' + process.env.PORT)
})
