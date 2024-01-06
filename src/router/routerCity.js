import express from 'express'
import {
  getCityById,
  getCities,
  createCity,
  deleteCity,
  updateCity,
} from '../controllers/cityController.js'
import validateQueryParams from '../middleware/city/validateQueryParams.js'
import validateCityData from '../middleware/city/validateCityData.js'
import { passportJwtAuthentication } from '../middleware/auth.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCities),
  express.Router().get('/:id', getCityById),
  express
    .Router()
    .post(
      '/create',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      createCity
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateCityData,
      updateCity
    ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteCity
    ),
])

export default routerCity
