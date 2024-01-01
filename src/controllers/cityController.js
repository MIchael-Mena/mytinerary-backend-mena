import jsonResponse from '../utils/jsonResponse.js'
import {
  deleteCityService,
  deleteItinerariesService,
  getCityByIdService,
  updateCityService,
  getCitiesResultsService,
  getQueryOptions,
  getSortOptions,
  createCityService,
} from '../services/cityService.js'

const getCitiesNotFoundMessage = (searchQuery) => {
  return searchQuery
    ? `No cities found starting with '${searchQuery}'.`
    : 'Cities not found.'
}

// Ejemplo del endpoint: /city?sort=rating&order=desc&limit=5&page=2&search=bar&populate_itineraries=true
const getCities = async (req, res, next) => {
  try {
    const sortOptions = getSortOptions(req.query)
    const { limit, page, queryToFind } = getQueryOptions(req.query)
    const popItineraries =
      req.query['populate_itineraries'] === 'true' &&
      req.query['basic_info'] !== 'true'

    const { cities, totalPages, totalCitiesCount } =
      await getCitiesResultsService(
        queryToFind,
        sortOptions,
        page,
        limit,
        popItineraries,
        req.query['basic_info'] === 'true'
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
        totalPages,
        totalCitiesCount,
        cities,
      }
    )
  } catch (error) {
    next(error)
  }
}

// Se espera recibir: req.body = [{city}, {city}] || {city}
const createCity = async (req, res, next) => {
  try {
    const cities = await createCityService(req.body)
    jsonResponse(true, res, 201, 'Cities created successfully.', cities)
  } catch (error) {
    next(error)
  }
}

const getCityById = async (req, res, next) => {
  try {
    const cityFound = await getCityByIdService(req.params.id)

    jsonResponse(true, res, 200, 'City retrieved successfully.', cityFound)
  } catch (error) {
    next(error)
  }
}

const updateCity = async (req, res, next) => {
  try {
    const cityUpdated = await updateCityService(req.params.id, req.body)

    jsonResponse(true, res, 200, 'City updated successfully.', cityUpdated)
  } catch (error) {
    next(error)
  }
}

const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await deleteCityService(id)

    jsonResponse(true, res, 200, 'City deleted successfully.', result)
  } catch (error) {
    next(error)
  }
}

const deleteItineraries = async (req, res, next) => {
  try {
    const { cityId } = req.params
    const city = await deleteItinerariesService(cityId)

    city.itineraries = [] // Vaciamos el array de itinerarios, porque me devuelve los itinerarios que se han borrado

    await city.save()

    jsonResponse(true, res, 200, 'Itineraries deleted successfully.')
  } catch (error) {
    next(error)
  }
}

export {
  getCities as getCities,
  createCity as createCity,
  getCityById,
  updateCity,
  deleteCity,
  deleteItineraries,
}
