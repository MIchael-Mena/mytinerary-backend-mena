import express from 'express'
import {
  getItinerary,
  createItinerary,
  deleteItinerary,
  updateItinerary,
} from '../controllers/itineraryController.js'

const routerItinerary = express.Router()

routerItinerary.use('/itinerary', [
  express.Router().get('/:id', getItinerary),
  express.Router().post('/create', createItinerary),
  express.Router().delete('/delete/:id', deleteItinerary),
  express.Router().patch('/update/:id', updateItinerary),
])

export default routerItinerary
