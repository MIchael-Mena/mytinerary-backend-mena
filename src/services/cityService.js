import City from '../models/City.js'
import Itinerary from '../models/Itinerary.js'
import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'

const populateCity = {
  path: 'itineraries',
  populate: {
    path: 'user',
    select: 'firstName lastName profilePic',
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

const getCitiesResultsService = async (
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

  return { cities, totalPages, totalCitiesCount }
}

const getTotalCitiesCountService = async (query) => {
  const countResult = await City.aggregate([
    { $match: query },
    { $count: 'count' },
  ])
  const totalCitiesCount = countResult[0]?.count || 0
  return totalCitiesCount
}

const deleteItinerariesService = async (cityId) => {
  validateId(cityId, 'City')
  const city = await City.findById(cityId)
  verifyCityExists(city, cityId)

  const { itineraries } = city

  if (itineraries.length === 0)
    throw new NotFoundError('There are no itineraries to delete for this city.')

  await Itinerary.deleteMany({ _id: { $in: itineraries } })

  return city
}

const deleteCityService = async (cityId) => {
  validateId(cityId, 'City')
  const city = await City.findByIdAndDelete(cityId)
  verifyCityExists(city, cityId)

  // await city.deleteOne()

  await Itinerary.deleteMany({ _city: city._id })

  return city
}

const updateCityService = async (cityId, cityData) => {
  validateId(cityId, 'City')

  const cityToUpdate = await City.findByIdAndUpdate(cityId, cityData, {
    new: true,
    runValidators: true,
  })

  verifyCityExists(cityToUpdate, cityId)

  // Como segundo parametro se puede pasar un objeto con las opciones de la query
  // const cityUpdated = await City.updateOne(
  //   {
  //     _id: itinerary._city,
  //   },
  //   { $pull: { itineraries: req.params.id } }
  // )

  // Resultado de cityToUpdate en caso de exito (si no se usa la opcion {new: true}):
  //     {
  //   acknowledged: true,
  //   modifiedCount: 1,
  //   upsertedId: null,
  //   upsertedCount: 0,
  //   matchedCount: 1
  // }

  return cityToUpdate
}

const getCityByIdService = async (cityId, shouldBePopulated = true) => {
  validateId(cityId, 'City')
  // const city = await City.findById(cityId).populate(populateCity)
  const city = await City.findById(cityId)
  verifyCityExists(city, cityId)

  if (shouldBePopulated) await city.populate(populateCity)

  return city
}

const createCityService = async (cityData) => {
  const cities = await City.insertMany(cityData)
  return cities
}

const verifyCityExists = (city, cityID) => {
  if (!city) throw new NotFoundError(`City with id '${cityID}' not found.`)
}

export {
  deleteItinerariesService,
  deleteCityService,
  updateCityService,
  getCityByIdService,
  getCitiesResultsService,
  getTotalCitiesCountService,
  getQueryOptions,
  getSortOptions,
  createCityService,
}
