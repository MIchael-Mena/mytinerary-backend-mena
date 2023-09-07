import jsonResponse from '../utils/jsonResponse.js'
import {
  deleteCity,
  deleteItineraries,
  getCityById,
  updateCity,
  getCitiesResults,
  getQueryOptions,
  getSortOptions,
  createCity,
} from '../services/cityService.js'

const getCitiesNotFoundMessage = (searchQuery) => {
  return searchQuery
    ? `No cities found starting with '${searchQuery}'.`
    : 'Cities not found.'
}

// Ejemplo del endpoint: /city?sort=rating&order=desc&limit=5&page=2&search=bar&popItineraries=true
const getCitiesController = async (req, res, next) => {
  try {
    const sortOptions = getSortOptions(req.query)
    const { limit, page, queryToFind } = getQueryOptions(req.query)
    const popItineraries = req.query['popItineraries'] === 'true'

    const { cities, totalPages } = await getCitiesResults(
      queryToFind,
      sortOptions,
      page,
      limit,
      popItineraries
    )

    const hasCities = cities.length > 0

    jsonResponse(
      hasCities,
      res,
      200,
      !hasCities
        ? getCitiesNotFoundMessage(req.query.search)
        : 'Cities retrieved successfully.',
      {
        cities,
        totalPages,
      }
    )
  } catch (error) {
    next(error)
  }
}

// Se espera recibir: req.body = [{city}, {city}] || {city}
const createCityController = async (req, res, next) => {
  try {
    const cities = await createCity(req.body)
    jsonResponse(true, res, 201, 'Cities created successfully.', cities)
  } catch (error) {
    next(error)
  }
}

const getCityByIdController = async (req, res, next) => {
  try {
    const cityFound = await getCityById(req.params.id)

    jsonResponse(true, res, 200, 'City retrieved successfully.', cityFound)
  } catch (error) {
    next(error)
  }
}

const updateCityController = async (req, res, next) => {
  try {
    const cityUpdated = await updateCity(req.params.id, req.body)

    jsonResponse(true, res, 200, 'City updated successfully.', cityUpdated)
  } catch (error) {
    next(error)
  }
}

const deleteCityController = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await deleteCity(id)

    jsonResponse(true, res, 200, 'City deleted successfully.', result)
  } catch (error) {
    next(error)
  }
}

const deleteItinerariesController = async (req, res, next) => {
  try {
    const { cityId } = req.params
    const city = await deleteItineraries(cityId)

    city.itineraries = [] // Vaciamos el array de itinerarios, porque me devuelve los itinerarios que se han borrado

    await city.save()

    jsonResponse(true, res, 200, 'Itineraries deleted successfully.')
  } catch (error) {
    next(error)
  }
}

export {
  getCitiesController,
  createCityController,
  getCityByIdController,
  updateCityController,
  deleteCityController,
  deleteItinerariesController,
}
