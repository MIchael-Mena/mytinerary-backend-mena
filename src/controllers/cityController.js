import City from '../models/City.js'
import Itinerary from '../models/Itinerary.js'
import jsonResponse from '../utils/jsonResponse.js'
import {
  buildAggregationPipeline,
  getNoCitiesMessage,
  getQueryOptions,
  getSortOptions,
} from './util.js'

const populateItinerariesOption = {
  path: 'itineraries',
  populate: {
    path: 'user',
    select: 'name surname profilePic',
  },
}

// Ejemplo del endpoint: /city?sort=rating&order=desc&limit=5&page=2&search=bar&popItineraries=true
// Version Alternativa con agregación, ventaja: se puede obtener el total de documentos sin necesidad de hacer un countDocuments
const getCities = async (req, res, next) => {
  try {
    const sortOptions = getSortOptions(req)
    const { limit, page, query } = getQueryOptions(req)

    const aggregationPipeline = buildAggregationPipeline(
      query,
      sortOptions,
      page,
      limit
    )
    const [aggregationResult] = await City.aggregate(aggregationPipeline)

    const cities = aggregationResult.results
    const totalCitiesCount = aggregationResult.totalCount[0]?.count || 0

    if (cities.length === 0) {
      return jsonResponse(
        false,
        res,
        200,
        getNoCitiesMessage(req.query.search),
        cities
      )
    }

    if (req.query['popItineraries'] === 'true') {
      await City.populate(cities, populateItinerariesOption)
    }

    const totalPages = Math.ceil(totalCitiesCount / limit)

    jsonResponse(true, res, 200, 'Cities retrieved successfully.', {
      cities,
      totalPages,
    })
  } catch (error) {
    next(error)
  }
}

// Se espera recibir: req.body = [{city}, {city}] || {city}
const createCity = async (req, res, next) => {
  try {
    const cities = await City.insertMany(req.body)
    jsonResponse(true, res, 201, 'Cities created successfully.', cities)
  } catch (error) {
    next(error)
  }
}

const getCityById = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id).populate(
      populateItinerariesOption
    )

    if (!city) return jsonResponse(false, res, 404, 'City not found.')
    jsonResponse(true, res, 200, 'City retrieved successfully.', city)
  } catch (error) {
    next(error)
  }
}

const updateCityOrReplace = async (updateMethod, req, res, next) => {
  try {
    // El itinerario se puede actualizar en los endpoints de itinerario
    const cityData = req.body
    if (cityData.itineraries) {
      delete cityData.itineraries
    }
    const city = await updateMethod({ _id: req.params.id }, cityData, {
      new: true, // devuelve el documento modificado
      runValidators: true, // ejecuta las validaciones del modelo
    })
    if (!city) return jsonResponse(false, res, 404, 'City not found.')
    jsonResponse(true, res, 200, 'City updated successfully.', city)
  } catch (error) {
    next(error)
  }
}

const updateCity = async (req, res, next) => {
  await updateCityOrReplace(
    (condition, update, options) =>
      City.findOneAndUpdate(condition, update, options),
    req,
    res,
    next
  )
}

const replaceCity = async (req, res, next) => {
  await updateCityOrReplace(
    (condition, replace, options) =>
      City.findOneAndReplace(condition, replace, options),
    req,
    res,
    next
  )
}

const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id)
    if (!city) return jsonResponse(false, res, 404, 'City not found.')

    await Itinerary.deleteMany({ _city: city._id })

    await city.deleteOne()

    jsonResponse(true, res, 200, 'City deleted successfully.')
  } catch (error) {
    next(error)
  }
}

const deleteItineraries = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id)
    if (!city) return jsonResponse(false, res, 404, 'City not found.')

    const { itineraries } = city

    if (itineraries.length === 0)
      return jsonResponse(
        false,
        res,
        404,
        'There are no itineraries to delete.'
      )

    await Itinerary.deleteMany({ _id: { $in: itineraries } })

    city.itineraries = []

    await city.save()

    jsonResponse(true, res, 200, 'Itineraries deleted successfully.')
  } catch (error) {
    next(error)
  }
}

export {
  getCities,
  getCityById,
  createCity,
  updateCity,
  replaceCity,
  deleteCity,
  deleteItineraries,
}
