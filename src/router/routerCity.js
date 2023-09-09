import express from 'express'
import {
  getCityById,
  getCities,
  createCity,
  deleteCity,
  deleteItineraries,
  updateCity,
} from '../controllers/cityController.js'
import validateQueryParams from '../middleware/city/validateQueryParams.js'
import validateCityData from '../middleware/city/validateCityData.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCities),
  express.Router().get('/:id', getCityById),
  express.Router().post('/create', createCity),
  express.Router().patch('/update/:id', validateCityData, updateCity),
  express.Router().delete('/delete/:id', deleteCity),
  express.Router().delete('/delete-itineraries/:cityId', deleteItineraries),
])

export default routerCity
