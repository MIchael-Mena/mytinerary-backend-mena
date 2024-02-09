import jsonResponse from '../utils/jsonResponse.js'
import {
  addLikeToItineraryService,
  createItinerariesService,
  deleteItinerariesByCityIdService,
  deleteItineraryService,
  getItinerariesByCityIdService,
  getItineraryByIdService,
  removeLikeFromItineraryService,
  updateItineraryService,
} from '../services/itineraryService.js'

const createItineraries = async (req, res, next) => {
  try {
    const isArrayOfItineraries = Array.isArray(req.body)
    const itinerariesData = isArrayOfItineraries ? req.body : [req.body]
    const itineraries = await createItinerariesService(
      itinerariesData,
      req.user.id
    )

    jsonResponse(
      true,
      res,
      201,
      isArrayOfItineraries
        ? 'Itineraries created successfully.'
        : 'Itinerary created successfully.',
      itineraries
    )
  } catch (error) {
    next(error)
  }
}

const getItinerariesByCityId = async (req, res, next) => {
  try {
    const itineraries = await getItinerariesByCityIdService(req.params.cityId)

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
    await deleteItineraryService(req.params.id)

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
      req.user
    )

    jsonResponse(true, res, 200, 'Like added successfully.', {
      totalLikes,
      itineraryId,
    })
  } catch (error) {
    next(error)
  }
}

const removeLikeFromItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id

    const { totalLikes } = await removeLikeFromItineraryService(
      itineraryId,
      req.user
    )

    jsonResponse(true, res, 200, 'Like removed successfully.', {
      totalLikes,
      itineraryId,
    })
  } catch (error) {
    next(error)
  }
}

const deleteItinerariesByCityId = async (req, res, next) => {
  try {
    const { cityId } = req.params
    const city = await deleteItinerariesByCityIdService(cityId)
    jsonResponse(true, res, 200, 'Itineraries deleted successfully.')
  } catch (error) {
    next(error)
  }
}

export {
  createItineraries,
  getItineraryById,
  deleteItinerary,
  deleteItinerariesByCityId,
  updateItinerary,
  getItinerariesByCityId,
  addLikeToItinerary,
  removeLikeFromItinerary,
}
