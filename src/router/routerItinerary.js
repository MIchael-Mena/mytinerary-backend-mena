import express from 'express'
import {
  getItineraryById,
  createItinerary,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
} from '../controllers/itineraryController.js'

const routerItinerary = express.Router()

routerItinerary.use('/itinerary', [
  express.Router().get('/:id', getItineraryById),
  express.Router().get('/:cityId', getItinerariesByCityId),
  express.Router().post('/create', createItinerary),
  express.Router().delete('/delete/:id', deleteItinerary),
  express.Router().patch('/update/:id', updateItinerary),
])

export default routerItinerary
