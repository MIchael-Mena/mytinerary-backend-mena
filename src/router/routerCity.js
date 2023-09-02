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
import validateId from '../middleware/validateId.js'

const routerCity = express.Router()

routerCity.use('/city', [
  express.Router().get('/', validateQueryParams, getCity),
  express.Router().get('/:id', validateId, getCityById),
  express.Router().post('/create', createCity),
  express.Router().patch('/update/:id', validateId, updateCity),
  express.Router().put('/replace/:id', validateId, replaceCity),
  express.Router().delete('/delete/:id', validateId, deleteCity),
])

export default routerCity
