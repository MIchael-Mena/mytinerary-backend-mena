import jsonResponse from '../utils/jsonResponse.js'
import {
  addLikeToItineraryService,
  createItinerariesService,
  deleteItineraryService,
  getItinerariesByCityIdService,
  getItineraryByIdService,
  removeLikeFromItineraryService,
  updateItineraryService,
  userHasLikedItineraryService,
} from '../services/itineraryService.js'
import { updateCityService } from '../services/cityService.js'

// Puede resivir una lista de itinerarios o un solo itinerario
const createItinerary = async (req, res, next) => {
  try {
    const itinerariesData = Array.isArray(req.body) ? req.body : [req.body]

    const itineraries = await createItinerariesService(itinerariesData)

    jsonResponse(
      true,
      res,
      201,
      'Itineraries created successfully.',
      itineraries
    )
  } catch (error) {
    next(error)
  }
}

const getItinerariesByCityId = async (req, res, next) => {
  try {
    const itineraries = await getItinerariesByCityIdService(req.params.id)

    if (itineraries.length === 0)
      return jsonResponse(
        false,
        res,
        404,
        'There are no itineraries for this city.'
      )

    jsonResponse(
      true,
      res,
      200,
      'Itineraries retrieved successfully.',
      itineraries
    )
  } catch (error) {
    next(error)
  }
}

const getItineraryById = async (req, res, next) => {
  try {
    const itinerary = await getItineraryByIdService(req.params.id)

    jsonResponse(true, res, 200, 'Itinerary retrieved successfully.', itinerary)
  } catch (error) {
    next(error)
  }
}

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await deleteItineraryService(req.params.id)

    const city = await updateCityService(itinerary._city, {
      $pull: { itineraries: req.params.id },
    })

    jsonResponse(true, res, 200, 'Itinerary deleted successfully.')
  } catch (error) {
    next(error)
  }
}

const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await updateItineraryService(req.params.id, req.body)

    jsonResponse(true, res, 200, 'Itinerary updated successfully.', itinerary)
  } catch (error) {
    next(error)
  }
}

const addLikeToItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id

    const { totalLikes } = await addLikeToItineraryService(
      itineraryId,
      req.user.id
    )

    jsonResponse(true, res, 200, 'Like added successfully.', { totalLikes })
  } catch (error) {
    next(error)
  }
}

const removeLikeFromItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id

    const { totalLikes } = await removeLikeFromItineraryService(
      itineraryId,
      req.user.id
    )

    jsonResponse(true, res, 200, 'Like removed successfully.', { totalLikes })
  } catch (error) {
    next(error)
  }
}

const userHasLikedItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id

    const { hasLiked } = await userHasLikedItineraryService(
      itineraryId,
      req.user.id
    )

    jsonResponse(
      hasLiked,
      res,
      200,
      hasLiked ? 'User has liked itinerary.' : 'User has not liked itinerary.'
    )
  } catch (error) {
    next(error)
  }
}

export {
  createItinerary,
  getItineraryById,
  deleteItinerary,
  updateItinerary,
  getItinerariesByCityId,
  addLikeToItinerary,
  removeLikeFromItinerary,
  userHasLikedItinerary,
}
