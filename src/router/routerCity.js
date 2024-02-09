import express from 'express'
import {
  getCityById,
  getCities,
  createCity,
  deleteCity,
  updateCity,
} from '../controllers/cityController.js'
import validateCityData from '../middleware/validations/validateCityData.js'
import {
  passportJwtAuthentication,
  validateUserRole,
} from '../middleware/auth.js'
import validateQueryParams from '../middleware/validations/validateQueryParams.js'

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
  express.Router().get('/', validateQueryParams(validSortParam), getCities),
  express.Router().get('/:id', getCityById),
  express
    .Router()
    .post(
      '/create',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      createCity
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      validateCityData,
      updateCity
    ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      deleteCity
    ),
])

export default routerCity
