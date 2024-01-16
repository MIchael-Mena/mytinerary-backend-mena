import { commentSchema } from '../models/CommentValidation.js'
import jsonResponse from '../utils/jsonResponse.js'

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

export { validateComment }
