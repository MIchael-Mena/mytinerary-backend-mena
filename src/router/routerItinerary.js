import express from 'express'
import {
  getItineraryById,
  createItinerary,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
  addLikeToItinerary,
  removeLikeFromItinerary,
  userHasLikedItinerary,
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
  express.Router().post(
    '/like/:id', // Itinerary ID in params and user Id in req.user.id
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    addLikeToItinerary
  ),
  express.Router().delete(
    '/like/:id', // Itinerary ID in params and user Id in req.user.id
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    removeLikeFromItinerary
  ),
  express
    .Router()
    .post(
      '/check-user-like/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      userHasLikedItinerary
    ),
])

export default routerItinerary
