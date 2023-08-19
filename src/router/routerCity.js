import express from 'express'
import {
  getCities,
  createCities,
  getCity,
  createCity,
  updateCity,
  replaceCity,
  deleteCity,
} from '../controllers/cityController.js'
import validateQueryParams from '../middleware/city/validateQueryParams.js'

const routerCity = express.Router()

routerCity.get('/cities', validateQueryParams, getCities)
routerCity.post('/cities/create', createCities)

routerCity.get('/city/:id', getCity)
routerCity.post('/city/create', createCity)
routerCity.patch('/city/update/:id', updateCity)
routerCity.put('/city/replace/:id', replaceCity)
routerCity.delete('/city/delete/:id', deleteCity)

export default routerCity
