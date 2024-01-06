import express from 'express'
import {
  createComment,
  deleteComment,
  deleteCommentsByItineraryId,
  getCommentById,
  getCommentByItineraryId,
  updateComment,
} from '../controllers/commentController.js'

const routerComment = express.Router()

routerComment.use('/comment', [
  express.Router().get('/:id', getCommentById),
  express.Router().get('/for-itinerary/:itineraryId', getCommentByItineraryId),
  express.Router().post('/create', createComment),
  express.Router().delete('/delete/:id', deleteComment),
  express
    .Router()
    .delete('/delete-for-itinerary/:itineraryId', deleteCommentsByItineraryId),
  express.Router().patch('/update/:id', updateComment),
])

export default routerComment
