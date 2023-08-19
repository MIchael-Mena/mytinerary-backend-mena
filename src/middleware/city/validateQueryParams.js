import jsonResponse from '../../utils/jsonResponse.js'

const validateQueryParams = (req, res, next) => {
  const validSortOptions = ['asc', 'desc']

  if (
    req.query.sortByRating &&
    !validSortOptions.includes(req.query.sortByRating)
  ) {
    return jsonResponse(
      false,
      res,
      400,
      "Invalid value for 'sortByRating' query parameter. Valid values are 'asc' or 'desc'."
    )
  }

  if (req.query.limit) {
    const limitValue = parseInt(req.query.limit)

    if (isNaN(limitValue) || limitValue <= 0) {
      return jsonResponse(
        false,
        res,
        400,
        "Invalid value for 'limit' query parameter. It must be a positive number."
      )
    }
  }

  next()
}

export default validateQueryParams
