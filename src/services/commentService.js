import { NotFoundError } from '../exceptions/NotFoundError.js'
import Comment from '../models/Comment.js'
import Itinerary from '../models/Itinerary.js'
import User from '../models/User.js'
import { getItineraryByIdService } from './itineraryService.js'
import { getUserByIdService } from './userService.js'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'
import { validateId } from './util.js'
import { buildAggregationPipeline } from '../utils/queryHelper.js'
import { Types } from 'mongoose'

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

const verifyUserHasReachedMaxLimitCommentesInModel = async (
  user,
  model,
  modelType
) => {
  const maxCommentsPerModel = 5

  const verifyLimit =
    (await Comment.find({
      _user: user.id,
      onModel: modelType,
      _reference: model.id,
    }).countDocuments()) >= maxCommentsPerModel
  if (verifyLimit)
    throw new InvalidFieldError(
      `Has reached the maximum number of comments per ${modelType} (${maxCommentsPerModel}).`,
      409
    )
}

const createCommentService = async (commentData, userId) => {
  const user = await getUserByIdService(userId)

  const model = await getModelById(commentData.onModel, commentData._reference)

  // un usuario no puedo comentar mas de una vez en un mismo modelo (itinerario, etc)
  await verifyUserHasReachedMaxLimitCommentesInModel(
    user,
    model,
    commentData.onModel
  )

  const commentToCreate = {
    ...commentData,
    _user: user.id,
  }

  const newComment = await (
    await Comment.create(commentToCreate)
  ).populate({
    path: '_user',
    select: 'firstName lastName profilePic',
  })

  // model.id es la version string del id y model._id es la version ObjectId
  await updateCommentOnModel(newComment.id, commentData.onModel, model.id)
  user.comments.push(newComment.id)
  await user.save()

  return newComment
}

const verifyCommentExists = (commentId, comment) => {
  if (!comment)
    throw new NotFoundError(`Comment with id ${commentId} not found.`)
}

const deleteCommentService = async (comment) => {
  const { _id: commentId } = comment
  await deleteCommentOnModel(commentId, comment.onModel, comment._reference)
  await User.findByIdAndUpdate(comment._user, {
    $pull: { comments: commentId },
  })
  await comment.deleteOne()
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
  const commentText = { text: commentData.text } // Solo se puede modificar el texto del comentario
  const commentUpdated = await Comment.findByIdAndUpdate(
    commentId,
    commentText,
    {
      new: true, // devuelve el documento actualizado
    }
  )
    .populate({
      path: '_user',
      select: 'firstName lastName profilePic',
    })
    .orFail(new NotFoundError(`Comment with id ${commentId} not found.`))

  return commentUpdated
}

const getCommentByIdService = async (commentId) => {
  // Con esta opcion si el id no existe o existe pero no tiene comentarios se lanzara un error 404
  /*   const comment = await Comment.findById(commentId)
    .orFail(new NotFoundError(`Comment with id ${commentId} not found.`))
    .populate({
      path: '_user',
      select: 'firstName lastName profilePic',
    }) */

  validateId(commentId, 'Comment')
  const comment = await Comment.findById(commentId).populate({
    path: '_user',
    select: 'firstName lastName profilePic',
  })
  verifyCommentExists(commentId, comment)

  return comment
}

const buildLookupStage = () => ({
  // Alternativa a populate
  $lookup: {
    from: 'users',
    localField: '_user',
    foreignField: '_id',
    as: '_user',
  },
})

// Para deshacer el array que devuelve el lookup y quedarme solo con el primer elemento
const buildUnwindStage = () => ({ $unwind: '$_user' })

const buildProjectStage = () => ({
  // Para limitar los campos que se devuelven
  $project: {
    _id: 1,
    text: 1,
    _user: {
      _id: '$_user._id',
      firstName: '$_user.firstName',
      lastName: '$_user.lastName',
      profilePic: '$_user.profilePic',
    },
    _reference: 1,
    onModel: 1,
    createdAt: 1,
    updatedAt: 1,
  },
})

const getCommentByItineraryIdService = async (
  itineraryId,
  page,
  limit,
  sortOptions
) => {
  await getItineraryByIdService(itineraryId)

  const lookup = buildLookupStage()
  const unwind = buildUnwindStage()
  const project = buildProjectStage()

  const filterItineraryId = { _reference: new Types.ObjectId(itineraryId) }

  const aggregationPipeline = buildAggregationPipeline(
    filterItineraryId,
    sortOptions,
    page,
    limit,
    lookup,
    unwind,
    project
  )

  let aggregationResult
  // try catch usado para poder detectar errores en el pipeline de agregacion durante el desarrollo
  try {
    ;[aggregationResult] = await Comment.aggregate(aggregationPipeline)
  } catch (error) {
    console.error(error)
    throw new Error('Error while aggregating comments')
  }

  const { results, totalCount } = aggregationResult

  const commentsTotalCount = results.length > 0 ? totalCount[0].count : 0

  const totalPages = limit > 0 ? Math.ceil(commentsTotalCount / limit) : 1

  return { comments: results, totalPages, totalCount: commentsTotalCount }
}

export {
  updateCommentService,
  deleteCommentsByItineraryIdService,
  deleteCommentService,
  createCommentService,
  getCommentByIdService,
  getCommentByItineraryIdService,
}
