import express from 'express'
import {
  getItineraryById,
  createItineraries,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
  addLikeToItinerary,
  removeLikeFromItinerary,
  deleteItinerariesByCityId,
} from '../controllers/itineraryController.js'
import {
  passportJwtAuthentication,
  validateUserRole,
} from '../middleware/auth.js'
import validateItineraryData from '../middleware/validations/validateItineraryData.js'

const routerItinerary = express.Router()

routerItinerary.use('/itinerary', [
  express.Router().get('/:id', getItineraryById),
  express.Router().get('/for-city/:cityId', getItinerariesByCityId),
  express.Router().post(
    '/create',
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    validateUserRole('admin'),
    validateItineraryData, // TODO: agregar validaciones con JOi
    createItineraries
  ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      deleteItinerary
    ),
  express
    .Router()
    .delete(
      '/delete-for-city/:cityId',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      deleteItinerariesByCityId
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      updateItinerary
    ),
  express.Router().post(
    '/like/:id', // Itinerary ID in params
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    validateUserRole('admin'),
    addLikeToItinerary
  ),
  express.Router().delete(
    '/dislike/:id', // Itinerary ID in params
    passportJwtAuthentication.authenticate('jwt', { session: false }),
    validateUserRole('admin'),
    removeLikeFromItinerary
  ),
])

export default routerItinerary
