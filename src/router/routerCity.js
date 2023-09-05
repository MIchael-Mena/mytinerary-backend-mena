import express from 'express'
import {
  getCityById,
  getCities,
  createCity,
  updateCity,
  replaceCity,
  deleteCity,
  deleteItineraries,
} from '../controllers/cityController.js'
import validateQueryParams from '../middleware/city/validateQueryParams.js'
import validateId from '../middleware/validateId.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCities),
  express.Router().get('/:id', validateId, getCityById),
  express.Router().post('/create', createCity),
  express.Router().patch('/update/:id', validateId, updateCity),
  express.Router().put('/replace/:id', validateId, replaceCity),
  express.Router().delete('/delete/:id', validateId, deleteCity),
  express
    .Router()
    .delete('/delete-itineraries/:id', validateId, deleteItineraries),
])

export default routerCity
