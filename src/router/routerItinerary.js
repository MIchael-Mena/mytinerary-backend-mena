import express from 'express'
import {
  getItineraryById,
  createItinerary,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
} from '../controllers/itineraryController.js'
import validateId from '../middleware/validateId.js'

const routerItinerary = express.Router()

routerItinerary.use('/itinerary', [
  express.Router().get('/:id', validateId, getItineraryById),
  express.Router().get('/:cityId', validateId, getItinerariesByCityId),
  express.Router().post('/create', createItinerary),
  express.Router().delete('/delete/:id', validateId, deleteItinerary),
  express.Router().patch('/update/:id', validateId, updateItinerary),
])

export default routerItinerary
