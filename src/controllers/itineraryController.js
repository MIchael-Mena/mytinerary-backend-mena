import Itinerary from '../models/Itinerary.js'
import City from '../models/City.js'
import jsonResponse from '../utils/jsonResponse.js'
import User from '../models/User.js'
import { Types } from 'mongoose'

const populateItinerary = [
  {
    path: '_city',
    select: 'name country',
  },
  {
    path: 'user',
    select: 'name surname profilePic',
  },
]

const createItinerary = async (req, res, next) => {
  try {
    const itinerariesData = Array.isArray(req.body) ? req.body : [req.body]

    const itineraryPromises = []

    for (const itineraryData of itinerariesData) {
      const { _city, user } = itineraryData

      const cityIdIsValid = Types.ObjectId.isValid(_city)
      const userIdIsValid = Types.ObjectId.isValid(user)
      if (!cityIdIsValid || !userIdIsValid) {
        return jsonResponse(
          false,
          res,
          404,
          cityIdIsValid
            ? `User '${user}' not found`
            : `City '${_city}' not found`
        )
      }

      const cityExist = await City.findById(_city)
      const userExist = await User.findById(user)

      if (!cityExist || !userExist) {
        return jsonResponse(
          false,
          res,
          404,
          cityExist ? `User '${user}' not found` : `City '${_city}' not found`
        )
      }

      const newItinerary = await (
        await Itinerary.create(itineraryData)
      ).populate(populateItinerary)

      cityExist.itineraries.push(newItinerary.id)
      await cityExist.save()

      itineraryPromises.push(newItinerary)
    }

    const newItineraries = await Promise.all(itineraryPromises)

    jsonResponse(true, res, 201, newItineraries)
  } catch (error) {
    next(error)
  }
}

const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate(
      populateItinerary
    )

    if (!itinerary) return jsonResponse(false, res, 404, 'Itinerary not found')

    jsonResponse(true, res, 200, 'Itinerary retrieved successfully.', itinerary)
  } catch (error) {
    next(error)
  }
}

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id)

    if (!itinerary) return jsonResponse(false, res, 404, 'Itinerary not found')

    const cityUpdated = await City.updateOne(
      {
        _id: itinerary._city,
      },
      { $pull: { itineraries: req.params.id } }
    )

    // Resultado de cityUpdated si se ha eliminado correctamente:
    //     {
    //   acknowledged: true,
    //   modifiedCount: 1,
    //   upsertedId: null,
    //   upsertedCount: 0,
    //   matchedCount: 1
    // }

    jsonResponse(true, res, 200, 'Itinerary deleted successfully.')
  } catch (error) {
    next(error)
  }
}

const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate(populateItinerary)

    if (!itinerary) return jsonResponse(false, res, 404, 'Itinerary not found')

    jsonResponse(true, res, 200, 'Itinerary updated successfully.', itinerary)
  } catch (error) {
    next(error)
  }
}

export { createItinerary, getItinerary, deleteItinerary, updateItinerary }
