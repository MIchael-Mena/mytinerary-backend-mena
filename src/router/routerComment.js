import express from 'express'
import {
  createComment,
  deleteComment,
  deleteCommentsByItineraryId,
  getCommentById,
  getCommentByItineraryId,
  updateComment,
} from '../controllers/commentController.js'
import { passportJwtAuthentication } from '../middleware/auth.js'
import { validateComment } from '../middleware/validateComment.js'

const routerComment = express.Router()

routerComment.use('/comment', [
  express.Router().get('/:id', getCommentById),
  express.Router().get('/for-itinerary/:itineraryId', getCommentByItineraryId),
  express
    .Router()
    .post(
      '/create',
      validateComment,
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      createComment
    ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteComment
    ),
  express
    .Router()
    .delete(
      '/delete-for-itinerary/:itineraryId',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      deleteCommentsByItineraryId
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      validateComment,
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      updateComment
    ),
])

export default routerComment
