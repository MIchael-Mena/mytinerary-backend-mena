import { commentSchema } from '../../models/CommentValidation.js'
import { getCommentByIdService } from '../../services/commentService.js'
import jsonResponse from '../../utils/jsonResponse.js'

const validateComment = (req, res, next) => {
  const commentValidation = commentSchema.validate(req.body, {
    abortEarly: false,
  })
  if (commentValidation.error)
    return jsonResponse(
      false,
      res,
      400,
      commentValidation.error.details.map((error) => error.message)
    )

  req.body = commentValidation.value

  next()
}

const verifyUserCommentOwnership = async (req, res, next) => {
  try {
    const commentId = req.params.id
    const comment = await getCommentByIdService(commentId)

    if (comment._user.toString() !== req.user.id)
      return jsonResponse(false, res, 403, 'Unauthorized')
    req.comment = comment
    next()
  } catch (error) {
    return jsonResponse(false, res, error.status, error.message)
  }
}

export { validateComment, verifyUserCommentOwnership }
