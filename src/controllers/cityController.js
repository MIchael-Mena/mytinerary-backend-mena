import City from '../models/City.js'
import jsonResponse from '../utils/jsonResponse.js'

// Query params, ej: /cities?sortByRating=desc&limit=5&search=bar
const getCities = async (req, res, next) => {
  try {
    const sortByRating = req.query.sortByRating === 'desc' ? -1 : 1
    const limit = req.query.limit ? parseInt(req.query.limit) : 0 // 0 = no limit

    let searchQuery = req.query.search
      ? req.query.search.trim().toLowerCase()
      : ''

    let query = searchQuery
      ? { name: { $regex: `^${searchQuery}`, $options: 'i' } } // Expresión regular de mongo
      : {}
    // const regex = new RegExp(`^${searchQuery}`, 'i') // Expresión regular de JS
    // query = { name: regex }

    const cities = await City.find(query)
      .sort({ rating: sortByRating })
      .limit(limit)

    if (cities.length === 0)
      return jsonResponse(false, res, 404, 'Cities not found.')

    jsonResponse(true, res, 200, 'Cities retrieved successfully.', cities)
  } catch (error) {
    next(error)
  }
}

const createCities = async (req, res, next) => {
  try {
    const cities = await City.insertMany(req.body)
    jsonResponse(true, res, 201, 'Cities created successfully.', cities)
  } catch (error) {
    next(error)
  }
}

const getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id)
    if (!city) return jsonResponse(false, res, 404, 'City not found.')
    res.status(200).json(city)
  } catch (error) {
    next(error)
  }
}

const createCity = async (req, res, next) => {
  try {
    const city = new City(req.body)
    await city.save()
    jsonResponse(true, res, 201, 'City created successfully.', city)
  } catch (error) {
    next(error)
  }
}

const updateCityOrReplace = async (updateMethod, req, res, next) => {
  try {
    const city = await updateMethod({ _id: req.params.id }, req.body, {
      new: true, // devuelve el documento modificado
      runValidators: true, // ejecuta las validaciones del modelo
    })
    if (!city) return jsonResponse(false, res, 404, 'City not found.')
    res.status(200).json(city)
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
    jsonResponse(true, res, 200, 'City deleted successfully.')
  } catch (error) {
    next(error)
  }
}

export {
  getCities,
  createCities,
  getCity,
  createCity,
  updateCity,
  replaceCity,
  deleteCity,
}
