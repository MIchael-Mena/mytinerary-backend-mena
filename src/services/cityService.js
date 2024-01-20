import City from '../models/City.js'
import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'
import { deleteItinerariesByCityIdService } from './itineraryService.js'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'

const populateCity = {
  path: 'itineraries', // Indico que quiero popular la propiedad 'itineraries' del modelo City
  populate: {
    // Indico que quiero popular la propiedad 'user' del modelo Itinerary
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
  const sortField = query.sort || 'updatedAt' // Si no se especifica el campo por el que se quiere ordenar, se ordena por fecha de actualización
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
        results: [{ $skip: (page - 1) * limit }, { $limit: limit }], // Paginación
        totalCount: [{ $count: 'count' }],
      },
    },
  ]
}

const populateItineraries = async (cities, mustBePopulated) => {
  if (!mustBePopulated) return Promise.resolve()
  await City.populate(cities, populateCity)
}

const getCitiesBasicInfo = (cities) => {
  return cities.map((city) => {
    const { _id, name, description, country, images } = city
    return { _id, name, description, country, images }
  })
}

const getCitiesResultsService = async (
  queryToFind,
  sortOptions,
  page,
  limit,
  hasPopulateParam,
  hasBasicInfoParam
) => {
  const aggregationPipeline = buildAggregationPipeline(
    queryToFind,
    sortOptions,
    page,
    limit
  )
  const [aggregationResult] = await City.aggregate(aggregationPipeline)
  let cities = aggregationResult.results
  await populateItineraries(cities, hasPopulateParam)

  const foundCitiesCount = aggregationResult.totalCount[0]?.count || 0
  const totalPages = Math.ceil(foundCitiesCount / limit)

  if (hasBasicInfoParam) cities = getCitiesBasicInfo(cities)

  return { cities, totalPages, foundCitiesCount }
}

const getFoundCitiesCountService = async (query) => {
  const countResult = await City.aggregate([
    { $match: query },
    { $count: 'count' },
  ])
  const foundCitiesCount = countResult[0]?.count || 0
  return foundCitiesCount
}

const deleteCityService = async (cityId) => {
  validateId(cityId, 'City')
  const city = await City.findByIdAndDelete(cityId)
  verifyCityExists(city, cityId) // Verifico que se haya encontrado la ciudad y por lo tanto eliminado

  await deleteItinerariesByCityIdService(cityId)

  return city
}

const updateCityService = async (cityId, cityData) => {
  // TODO: No se puede actualizar los itinerarios de una ciudad
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

const getCityByIdService = async (cityId, shouldBePopulated = false) => {
  validateId(cityId, 'City')

  const city = await City.findById(cityId)
  verifyCityExists(city, cityId)

  if (shouldBePopulated) await city.populate(populateCity)

  return city
}

const createCityService = async (cityData) => {
  const hasItineraries = Array.isArray(cityData)
    ? cityData.some((city) => city.itineraries.length > 0)
    : cityData.itineraries.length > 0

  if (hasItineraries)
    throw new InvalidFieldError(
      'Itineraries cannot be created with the city, use the itinerary endpoint.',
      409
    )

  const cities = await City.insertMany(cityData)
  return cities
}

const verifyCityExists = (city, cityID) => {
  if (!city) throw new NotFoundError(`City with id '${cityID}' not found.`)
}

export {
  deleteCityService,
  updateCityService,
  getCityByIdService,
  getCitiesResultsService,
  getFoundCitiesCountService,
  getQueryOptions,
  getSortOptions,
  createCityService,
}
