import jsonResponse from '../utils/jsonResponse.js'
import {
  deleteCityService,
  getCityByIdService,
  updateCityService,
  getCitiesResultsService,
  createCityService,
} from '../services/cityService.js'
import { getQueryOptions, getSortOptions } from '../utils/queryHelper.js'

const getCitiesNotFoundMessage = (searchQuery) => {
  return searchQuery
    ? `No cities found starting with '${searchQuery}'.`
    : 'Cities not found.'
}

// Ejemplo del endpoint: /city?sort=rating&order=desc&limit=5&page=2&search=bar&populate_itineraries=true&basic_info=true
const getCities = async (req, res, next) => {
  try {
    const sortOptions = getSortOptions(req.query)
    const { limit, page, queryToFind } = getQueryOptions(req.query)
    const popItineraries =
      req.query['populate_itineraries'] === 'true' &&
      req.query['basic_info'] !== 'true'

    const { cities, totalPages, totalCount } = await getCitiesResultsService(
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
        totalCount,
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
    const { populate_itineraries } = req.query
    const cityFound = await getCityByIdService(
      req.params.id,
      populate_itineraries === 'true'
    )

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

export { getCities, createCity, getCityById, updateCity, deleteCity }
