import express from 'express'
import {
  getCityByIdController,
  getCitiesController,
  createCityController,
  deleteCityController,
  deleteItinerariesController,
  updateCityController,
} from '../controllers/cityController.js'
import validateQueryParams from '../middleware/city/validateQueryParams.js'
import validateId from '../middleware/validateId.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCitiesController),
  express.Router().post('/create', createCityController),
  express.Router().get('/:id', getCityByIdController),
  express.Router().patch('/:id', updateCityController),
  express.Router().delete('/:id', deleteCityController),
  express
    .Router()
    .delete(
      '/delete-itineraries/:cityId',
      validateId,
      deleteItinerariesController
    ),
])

export default routerCity
