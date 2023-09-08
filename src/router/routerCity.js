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
import validateId from '../middleware/validateId.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCities),
  express.Router().post('/create', createCity),
  express.Router().get('/:id', getCityById),
  express.Router().patch('/:id', updateCity),
  express.Router().delete('/:id', deleteCity),
  express
    .Router()
    .delete('/delete-itineraries/:cityId', validateId, deleteItineraries),
])

export default routerCity
