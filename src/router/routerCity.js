import express from 'express'
import {
  getCityById,
  getCity,
  createCity,
  updateCity,
  replaceCity,
  deleteCity,
} from '../controllers/cityController.js'
import validateQueryParams from '../middleware/city/validateQueryParams.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCity),
  express.Router().get('/:id', getCityById),
  express.Router().post('/create', createCity),
  express.Router().patch('/update/:id', updateCity),
  express.Router().put('/replace/:id', replaceCity),
  express.Router().delete('/delete/:id', deleteCity),
])

export default routerCity
