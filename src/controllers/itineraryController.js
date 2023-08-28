import Itinerary from '../models/Itinerary.js'
import City from '../models/City.js'
import UserDetail from '../models/UserDetail.js'
import jsonResponse from '../utils/jsonResponse.js'

// TODO: Actualizar los id en City y UserDetail
const createItinerary = async (req, res, next) => {
  try {
    // const {userId, title, duration, price, hashtags, _city, activities, comments} = req.body
    const { _city, user } = req.body

    const cityExist = await City.findById(_city)
    const userExist = await UserDetail.find({ _user: user })

    if (!cityExist || !userExist)
      return jsonResponse(
        false,
        res,
        404,
        cityExist ? 'User not found' : 'City not found'
      )

    const newItinerary = await (
      await Itinerary.create({
        ...req.body,
        user: userExist[0]._id, // Remplazo el id de User por el id de UserDetail para el populate
      })
    ).populate([
      {
        path: '_city',
        select: 'name country',
      },
      {
        path: 'user',
        select: 'name surname profilePic',
      },
    ])

    jsonResponse(true, res, 201, newItinerary)
  } catch (error) {
    next(error)
  }
}

const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate([
      {
        path: '_city',
        select: 'name country',
      },
      {
        path: 'user',
        select: 'name surname profilePic',
      },
    ])

    if (!itinerary) return jsonResponse(false, res, 404, 'Itinerary not found')

    jsonResponse(true, res, 200, 'Itinerary retrieved successfully.', itinerary)
  } catch (error) {
    next(error)
  }
}

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id)

    console.log(itinerary)

    if (!itinerary) return jsonResponse(false, res, 404, 'Itinerary not found')

    jsonResponse(true, res, 200, 'Itinerary deleted successfully.')
  } catch (error) {
    next(error)
  }
}

export { createItinerary, getItinerary, deleteItinerary }
