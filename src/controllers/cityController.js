import City from '../models/City.js'
import Itinerary from '../models/Itinerary.js'
import jsonResponse from '../utils/jsonResponse.js'

const pagination = {
  limit: 16, // Cambiar a 12 despues de actualizar front
  page: 1,
}

// Ejemplo del endpoint: /city?sort=rating&order=desc&limit=5&page=2&search=bar
const getCity = async (req, res, next) => {
  try {
    const sortField = req.query.sort ? req.query.sort : 'updatedAt'
    const sortOrder = req.query.order === 'desc' ? -1 : 1

    const sortOptions = {
      [sortField]: sortOrder, // Se puede agregar más de un criterio de ordenamiento
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : pagination.limit // 0 = no limit
    const page = req.query.page ? parseInt(req.query.page) : pagination.page // 1 = first page
    let searchQuery = req.query.search
      ? req.query.search.trim().toLowerCase()
      : ''
    let query = searchQuery
      ? { name: { $regex: `^${searchQuery}`, $options: 'i' } } // Expresión regular de mongo
      : {}
    // const regex = new RegExp(`^${searchQuery}`, 'i') // Expresión regular de JS
    // query = { name: regex }

    const totalCitiesCount = await City.countDocuments(query)

    const cities = await City.find(query)
      // @ts-ignore
      .sort(sortOptions)
      .skip((page - 1) * limit) // Documentos a saltar
      .limit(limit)
      .populate({
        path: 'itineraries',
        populate: {
          path: 'user',
          select: 'name surname profilePic',
        },
      })

    if (cities.length === 0)
      return jsonResponse(
        false,
        res,
        200,
        searchQuery
          ? `No cities found starting with '${searchQuery}'.`
          : 'Cities not found.',
        cities
      )

    const maxPage = Math.ceil(totalCitiesCount / limit)

    jsonResponse(true, res, 200, { maxPage: maxPage.toString() }, cities)
  } catch (error) {
    next(error)
  }
}

// Version Alternativa con agregación, ventaja: se puede obtener el total de documentos sin necesidad de hacer un countDocuments
// const getCity = async (req, res, next) => {
//   try {
//     const pagination = {
//       limit: 9,
//       page: 1,
//     }

//     const sortField = req.query.sort ? req.query.sort : 'updatedAt'
//     const sortOrder = req.query.order === 'desc' ? -1 : 1

//     const sortOptions = {
//       [sortField]: sortOrder, // Se puede agregar más de un criterio de ordenamiento
//     }

//     const limit = req.query.limit ? parseInt(req.query.limit) : pagination.limit // 0 = no limit
//     const page = req.query.page ? parseInt(req.query.page) : pagination.page // 1 = first page
//     let searchQuery = req.query.search
//       ? req.query.search.trim().toLowerCase()
//       : ''
//     let query = searchQuery
//       ? { name: { $regex: `^${searchQuery}`, $options: 'i' } } // Expresión regular de mongo
//       : {}

//     const aggregationPipeline = [
//       {
//         $match: query,
//       },
//       {
//         $sort: sortOptions,
//       },
//       {
//         $facet: {
//           results: [{ $skip: (page - 1) * limit }, { $limit: limit }],
//           totalCount: [{ $count: 'count' }],
//         },
//       },
//     ]

//     // @ts-ignore
//     const [aggregationResult] = await City.aggregate(aggregationPipeline)

//     const cities = aggregationResult.results
//     const totalCitiesCount = aggregationResult.totalCount[0]?.count || 0

//     if (cities.length === 0)
//       return jsonResponse(
//         false,
//         res,
//         200,
//         searchQuery
//           ? `No cities found starting with '${searchQuery}'.`
//           : 'Cities not found.',
//         cities
//       )

//     await City.populate(cities, {
//       path: 'itineraries',
//       populate: {
//         path: 'user',
//         select: 'name surname profilePic',
//       },
//     })

//     const maxPage = Math.ceil(totalCitiesCount / limit)

//     jsonResponse(true, res, 200, { maxPage }, cities)
//   } catch (error) {
//     next(error)
//   }
// }

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
    const city = await City.findById(req.params.id).populate({
      path: 'itineraries',
      populate: {
        path: 'user',
        select: 'name surname profilePic',
      },
    })

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
    const { itineraries } = cityData
    if (itineraries) {
      delete cityData.itineraries
    }
    const city = await updateMethod({ _id: req.params.id }, itineraries, {
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
  getCity,
  getCityById,
  createCity,
  updateCity,
  replaceCity,
  deleteCity,
  deleteItineraries,
}
