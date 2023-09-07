import City from '../models/City.js'
import Itinerary from '../models/Itinerary.js'
import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'

const populateCity = {
  path: 'itineraries',
  populate: {
    path: 'user',
    select: 'name surname profilePic',
  },
}

const getPagination = (query) => {
  const defaultPagination = { limit: 9, page: 1 }
  const limit = query.limit ? parseInt(query.limit) : defaultPagination.limit
  const page = query.page ? parseInt(query.page) : defaultPagination.page
  return { limit, page }
}

const getSortOptions = (query) => {
  const sortField = query.sort || 'updatedAt'
  const sortOrder = query.order === 'desc' ? -1 : 1
  return { [sortField]: sortOrder }
}

const getQueryOptions = (query) => {
  const searchQuery = query.search ? query.search.trim().toLowerCase() : ''
  const queryToFind = searchQuery
    ? { name: { $regex: `^${searchQuery}`, $options: 'i' } }
    : {}
  return { ...getPagination(query), queryToFind }
}

const buildAggregationPipeline = (queryToFind, sortOptions, page, limit) => {
  return [
    { $match: queryToFind },
    { $sort: sortOptions },
    {
      $facet: {
        results: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]
}

const populateItineraries = async (cities, hasPopItinerariesParam) => {
  if (!hasPopItinerariesParam) return Promise.resolve()
  await City.populate(cities, populateCity)
}

const getCitiesResults = async (
  queryToFind,
  sortOptions,
  page,
  limit,
  hasPopItinerariesParam
) => {
  const aggregationPipeline = buildAggregationPipeline(
    queryToFind,
    sortOptions,
    page,
    limit
  )
  const [aggregationResult] = await City.aggregate(aggregationPipeline)
  const cities = aggregationResult.results
  await populateItineraries(cities, hasPopItinerariesParam)

  const totalCitiesCount = aggregationResult.totalCount[0]?.count || 0
  const totalPages = Math.ceil(totalCitiesCount / limit)

  return { cities, totalPages }
}

const getTotalCitiesCount = async (query) => {
  const countResult = await City.aggregate([
    { $match: query },
    { $count: 'count' },
  ])
  const totalCitiesCount = countResult[0]?.count || 0
  return totalCitiesCount
}

const deleteItineraries = async (cityId) => {
  validateId(cityId)
  const city = await City.findById(cityId)
  if (!city) throw new NotFoundError('City not found.', 404)

  const { itineraries } = city

  if (itineraries.length === 0)
    throw new NotFoundError('There are no itineraries to delete.', 404)

  await Itinerary.deleteMany({ _id: { $in: itineraries } })

  return city
}

const deleteCity = async (cityId) => {
  const city = await City.findByIdAndDelete(cityId)
  if (!city) {
    throw new NotFoundError('City not found.', 404)
  }
  // await city.deleteOne()

  await Itinerary.deleteMany({ _city: city._id })

  return city
}

const updateCity = async (cityId, cityData) => {
  validateId(cityId)
  // El itinerario se debe actualizar en los endpoints de itinerario
  if (cityData.itineraries) {
    delete cityData.itineraries
  }
  const cityToUpdate = await City.findByIdAndUpdate(cityId, cityData, {
    new: true,
    runValidators: true,
  })
  if (!cityToUpdate) {
    throw new NotFoundError('City not found.', 404)
  }
  return cityToUpdate
}

const getCityById = async (cityId) => {
  validateId(cityId)
  const city = await City.findById(cityId).populate(populateCity)
  if (!city) {
    throw new NotFoundError('City not found.', 404)
  }
  return city
}

const createCity = async (cityData) => {
  const cities = await City.insertMany(cityData)
  return cities
}

export {
  deleteItineraries,
  deleteCity,
  updateCity,
  getCityById,
  getCitiesResults,
  getTotalCitiesCount,
  getQueryOptions,
  getSortOptions,
  createCity,
}
