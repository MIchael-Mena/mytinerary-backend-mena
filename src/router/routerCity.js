import express from 'express'
import {
  getCityById,
  getCities,
  createCity,
  deleteCity,
  updateCity,
} from '../controllers/cityController.js'
import validateCityData from '../middleware/city/validateCityData.js'
import { passportJwtAuthentication } from '../middleware/auth.js'
import createValidateQueryParamsMiddleware from '../middleware/validateQueryParams.js'

const routerCity = express.Router()

const validSortParam = [
  'name',
  'country',
  'population',
  'area',
  'rating',
  'createdAt',
  'updatedAt',
]

routerCity.use('/city', [
  express
    .Router()
    .get('/', createValidateQueryParamsMiddleware(validSortParam), getCities),
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
