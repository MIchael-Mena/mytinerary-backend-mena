import jsonResponse from '../../utils/jsonResponse.js'

const notFoundHandler = (req, res, next) => {
  jsonResponse(false, res, 404, `${req.method} ${req.url} not found`)
}

export default notFoundHandler
