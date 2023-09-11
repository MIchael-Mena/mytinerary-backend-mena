import express from 'express'
import {
  getItineraryById,
  createItinerary,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
} from '../controllers/itineraryController.js'
import { passportJwtAuthentication } from '../middleware/auth.js'

const routerItinerary = express.Router()

routerItinerary.use('/itinerary', [
  express.Router().get('/:id', getItineraryById),
  express.Router().get('/:cityId', getItinerariesByCityId),
  express
    .Router()
    .post(
      '/create',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      createItinerary
    ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteItinerary
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      updateItinerary
    ),
])

export default routerItinerary
