import express from 'express'
import {
  getItineraryById,
  createItineraries,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
  addLikeToItinerary,
  removeLikeFromItinerary,
  userHasLikedItinerary,
  deleteItinerariesByCityId,
} from '../controllers/itineraryController.js'
import { passportJwtAuthentication } from '../middleware/auth.js'

const routerItinerary = express.Router()

routerItinerary.use('/itinerary', [
  express.Router().get('/:id', getItineraryById),
  express.Router().get('/for-city/:cityId', getItinerariesByCityId),
  express.Router().post(
    '/create', // TODO: agregar validaciones con JOi
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    createItineraries
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
    .delete(
      '/delete-for-city/:cityId',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteItinerariesByCityId
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
    '/dislike/:id', // Itinerary ID in params and user Id in req.user.id
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
