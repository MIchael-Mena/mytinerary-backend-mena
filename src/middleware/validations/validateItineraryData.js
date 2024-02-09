import { InvalidFieldError } from '../../exceptions/InvalidFieldError.js'

const validateItineraryData = (req, res, next) => {
  const itinerariesData = Array.isArray(req.body) ? req.body : [req.body]
  const errors = []

  const hasActivities = itinerariesData.some(
    (itinerary) => itinerary.activities && itinerary.activities.length > 0
  )

  const hasComments = itinerariesData.some(
    (itinerary) => itinerary.comments && itinerary.comments.length > 0
  )

  if (hasComments)
    errors.push(
      'Itineraries cannot have comments. Use the comment endpoint to add comments.'
    )

  if (hasActivities)
    errors.push(
      'Itineraries cannot have activities. Use the activity endpoint to add activities.'
    )

  if (itinerariesData.duration && itinerariesData.duration !== 0)
    errors.push(
      'Duration initial value must be 0. It will update automatically when activities are added.'
    )

  if (errors.length > 0) throw new InvalidFieldError(errors.join(' '))

  next()
}

export default validateItineraryData
