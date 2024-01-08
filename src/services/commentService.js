import { NotFoundError } from '../exceptions/NotFoundError.js'
import Comment from '../models/Comment.js'
import Itinerary from '../models/Itinerary.js'
import User from '../models/User.js'
import { getItineraryByIdService } from './itineraryService.js'
import { getUserByIdService } from './userService.js'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'
import { validateId } from './util.js'

const modifyCommentOnModel = async (
  commentId,
  modelType,
  modelId,
  operation
) => {
  switch (modelType) {
    case 'Itinerary':
      const update =
        operation === 'add'
          ? { $push: { comments: commentId } }
          : { $pull: { comments: commentId } }
      await Itinerary.findByIdAndUpdate(modelId, update)
      break
    default:
      throw new InvalidFieldError('Invalid model. Valid models: Itinerary.')
  }
}

const updateCommentOnModel = async (commentId, modelType, modelId) => {
  await modifyCommentOnModel(commentId, modelType, modelId, 'add')
}

const deleteCommentOnModel = async (commentId, modelType, modelId) => {
  await modifyCommentOnModel(commentId, modelType, modelId, 'remove')
}

const getModelById = async (model, id) => {
  switch (model) {
    case 'Itinerary':
      return await getItineraryByIdService(id)
    default:
      throw new InvalidFieldError('Invalid model. Valid models: Itinerary.')
  }
}

const verifyUserHasNotCommentedInModel = async (user, model, modelType) => {
  const hasCommented = await Comment.exists({
    _user: user.id,
    onModel: modelType,
    _reference: model.id,
  })

  if (hasCommented)
    throw new InvalidFieldError(
      `User has already commented on this ${modelType} with id ${model.id}.`,
      409
    )
}

const createCommentService = async (commentData) => {
  // TODO: un usuario no puedo comentar mas de una vez en un mismo modelo (itinerario, etc)
  const user = await getUserByIdService(commentData._user)

  const model = await getModelById(commentData.onModel, commentData._reference)

  await verifyUserHasNotCommentedInModel(user, model, commentData.onModel)

  const newComment = await Comment.create(commentData)

  // model.id es la version string del id y model._id es la version ObjectId
  await updateCommentOnModel(newComment.id, commentData.onModel, model.id)
  user.comments.push(newComment.id)
  await user.save()

  return newComment
}

const deleteCommentService = async (commentId) => {
  const comment = await Comment.findByIdAndDelete(commentId)

  await deleteCommentOnModel(commentId, comment.onModel, comment._reference)

  await User.findByIdAndUpdate(comment._user, {
    $pull: { comments: commentId },
  })
}

const deleteCommentsByItineraryIdService = async (itineraryId) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  const { comments } = itinerary

  if (comments.length === 0)
    throw new NotFoundError(
      'There are no comments to delete for this itinerary.'
    )

  comments.forEach(async (commentId) => await deleteCommentService(commentId))

  return itinerary
}

const updateCommentService = async (commentId, commentData) => {
  const comment = { text: commentData.text } // Solo se puede modificar el texto del comentario
  const commentUpdated = await Comment.findByIdAndUpdate(commentId, comment, {
    new: true, // devuelve el documento actualizado
  }).orFail(new NotFoundError(`Comment with id ${commentId} not found.`))

  return commentUpdated
}

const getCommentByIdService = async (commentId) => {
  const comment = await Comment.findById(commentId)
    .orFail(new NotFoundError(`Comment with id ${commentId} not found.`))
    .populate({
      path: '_user',
      select: 'firstName lastName profilePic',
    })

  return comment
}

const getCommentByItineraryIdService = async (itineraryId) => {
  validateId(itineraryId, 'Itinerary')
  const comments = await Comment.find({ _reference: itineraryId })
    .populate({
      path: '_user',
      select: 'firstName lastName profilePic',
    })
    .orFail(
      new NotFoundError(
        `Comments for itinerary with id ${itineraryId} not found.`
      )
    )

  return comments
}

export {
  updateCommentService,
  deleteCommentsByItineraryIdService,
  deleteCommentService,
  createCommentService,
  getCommentByIdService,
  getCommentByItineraryIdService,
}
