import {
  createCommentService,
  deleteCommentService,
  deleteCommentsByItineraryIdService,
  getCommentByIdService,
  getCommentByItineraryIdService,
  updateCommentService,
} from '../services/commentService.js'
import jsonResponse from '../utils/jsonResponse.js'
import { getQueryOptions, getSortOptions } from '../utils/queryHelper.js'

const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(req.body, req.user.id)
    jsonResponse(true, res, 201, 'Comment created successfully.', comment)
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    await deleteCommentService(req.comment)
    jsonResponse(true, res, 200, 'Comment deleted successfully.')
  } catch (error) {
    next(error)
  }
}

const deleteCommentsByItineraryId = async (req, res, next) => {
  try {
    await deleteCommentsByItineraryIdService(req.params.itineraryId)
    jsonResponse(true, res, 200, 'Comments deleted successfully.')
  } catch (error) {
    next(error)
  }
}

const updateComment = async (req, res, next) => {
  try {
    const comment = await updateCommentService(req.params.id, req.body)
    jsonResponse(true, res, 200, 'Comment updated successfully.', comment)
  } catch (error) {
    next(error)
  }
}

const getCommentById = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.id)
    jsonResponse(true, res, 200, 'Comment found.', comment)
  } catch (error) {
    next(error)
  }
}

const getCommentByItineraryId = async (req, res, next) => {
  try {
    const sortOptions = getSortOptions(req.query)
    const { limit, page } = getQueryOptions(req.query)

    const result = await getCommentByItineraryIdService(
      req.params.itineraryId,
      page,
      limit,
      sortOptions
    )
    jsonResponse(true, res, 200, 'Comments found.', result)
  } catch (error) {
    next(error)
  }
}

export {
  createComment,
  deleteComment,
  deleteCommentsByItineraryId,
  updateComment,
  getCommentByItineraryId,
  getCommentById,
}
