import express from 'express'
import {
  passportJwtAuthentication,
  validateUserRole,
} from '../middleware/auth.js'
import {
  createActivities,
  deleteActivitiesByItineraryId,
  deleteActivity,
  getActivitiesByItineraryId,
  getActivityById,
  updateActivity,
} from '../controllers/activityController.js'

const routerActivity = express.Router()

routerActivity.use('/activity', [
  express.Router().get('/:id', getActivityById),
  express
    .Router()
    .get('/for-itinerary/:itineraryId', getActivitiesByItineraryId),
  express
    .Router()
    .post(
      '/create',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      createActivities
    ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      deleteActivity
    ),
  express
    .Router()
    .delete(
      '/delete-for-itinerary/:itineraryId',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      deleteActivitiesByItineraryId
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      updateActivity
    ),
])

export default routerActivity
