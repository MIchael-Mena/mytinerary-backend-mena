import jsonResponse from '../../utils/jsonResponse.js'

const validateQueryParams = (req, res, next) => {
  const validSortOptions = ['asc', 'desc']
  const validSortFields = ['name', 'country', 'population', 'area', 'rating']
  const errors = []

  if (req.query.order && !validSortOptions.includes(req.query.order)) {
    errors.push(
      "Invalid value for 'order' query parameter. Valid values are 'asc' or 'desc'."
    )
  }

  if (req.query.page && req.query.page <= 0) {
    errors.push(
      "Invalid value for 'page' query parameter. It must be a positive number."
    )
  }

  if (req.query.limit) {
    const limitValue = parseInt(req.query.limit)

    if (isNaN(limitValue) || limitValue <= 0) {
      errors.push(
        "Invalid value for 'limit' query parameter. It must be a positive number."
      )
    }
  }

  if (req.query.sort && !validSortFields.includes(req.query.sort)) {
    errors.push(
      `Invalid value for 'sort' query parameter. Valid values are: ${validSortFields.join(
        ', '
      )}.`
    )
  }

  if (errors.length > 0) {
    return jsonResponse(false, res, 400, errors.join(' '))
  }

  next()
}

export default validateQueryParams
