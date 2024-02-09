import express from 'express'
import {
  createComment,
  deleteComment,
  deleteCommentsByItineraryId,
  getCommentById,
  getCommentByItineraryId,
  updateComment,
} from '../controllers/commentController.js'
import {
  passportJwtAuthentication,
  validateUserRole,
} from '../middleware/auth.js'
import validateQueryParams from '../middleware/validations/validateQueryParams.js'
import {
  validateComment,
  verifyUserCommentOwnership,
} from '../middleware/validations/commentValidations.js'

const routerComment = express.Router()

const validSortParam = ['updatedAt', 'createdAt']

routerComment.use('/comment', [
  express.Router().get('/:id', getCommentById),
  express
    .Router()
    .get(
      '/for-itinerary/:itineraryId',
      validateQueryParams(validSortParam),
      getCommentByItineraryId
    ),
  express
    .Router()
    .post(
      '/create',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole(['admin', 'user']),
      validateComment,
      createComment
    ),
  express
    .Router()
    .delete(
      '/delete/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole(['admin', 'user']),
      verifyUserCommentOwnership,
      deleteComment
    ),
  express
    .Router()
    .delete(
      '/delete-for-itinerary/:itineraryId',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole('admin'),
      deleteCommentsByItineraryId
    ),
  express
    .Router()
    .patch(
      '/update/:id',
      passportJwtAuthentication.authenticate('jwt', { session: false }),
      validateUserRole(['admin', 'user']),
      verifyUserCommentOwnership,
      validateComment,
      updateComment
    ),
])

export default routerComment
