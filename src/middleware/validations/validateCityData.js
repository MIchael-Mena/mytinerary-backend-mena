import jsonResponse from '../../utils/jsonResponse.js'

const validateCityData = (req, res, next) => {
  const { itineraries, ...rest } = req.body
  if (Object.keys(rest).length === 0) {
    return jsonResponse(
      false,
      res,
      400,
      'For update itineraries use the endpoint /itinerary/update/:id'
    )
  } else {
    delete req.body.itineraries
    next()
  }
}

export default validateCityData
