import { NotFoundError } from '../exceptions/NotFoundError.js'
import Itinerary from '../models/Itinerary.js'
import { getCityByIdService } from './cityService.js'
import { getUserByIdService } from './userService.js'
import { validateId } from './util.js'

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

const deleteItineraryService = async (id) => {
  validateId(id, 'Itinerary')
  const itinerary = await Itinerary.findByIdAndDelete(id)
  if (!itinerary)
    throw new NotFoundError(`Itinerary with id '${id}' not found.`)

  return itinerary
}

const updateItineraryService = async (id, itinerary) => {
  validateId(id, 'Itinerary')
  const itineraryUpdated = await Itinerary.findByIdAndUpdate(id, itinerary, {
    new: true,
    runValidators: true,
  })

  if (!itineraryUpdated)
    throw new NotFoundError(`Itinerary with id '${id}' not found.`)

  return itineraryUpdated
}

const getItineraryByIdService = async (id) => {
  validateId(id, 'Itinerary')
  const itinerary = await Itinerary.findById(id).populate(populateItinerary)

  if (!itinerary)
    throw new NotFoundError(`Itinerary with id '${id}' not found.`)

  return itinerary
}

const getItinerariesByCityIdService = async (cityId) => {
  validateId(cityId, 'City')
  const itineraries = await Itinerary.find({ _city: cityId }).populate(
    populateItinerary
  )
  return itineraries
}

const createItineraryService = async (itineraryData) => {
  const itinerary = (await Itinerary.create(itineraryData)).populate(
    populateItinerary
  )
  return itinerary
}

const createItinerariesService = async (itinerariesData) => {
  const itineraries = []
  for (const itineraryData of itinerariesData) {
    const { _city, user } = itineraryData

    const cityFounded = await getCityByIdService(_city, false)
    await getUserByIdService(user)

    const newItinerary = await createItineraryService(itineraryData)

    cityFounded.itineraries.push(newItinerary.id)
    await cityFounded.save()

    itineraries.push(newItinerary)
  }
  return Promise.all(itineraries)
}

export {
  deleteItineraryService,
  updateItineraryService,
  getItineraryByIdService,
  getItinerariesByCityIdService,
  createItineraryService,
  createItinerariesService,
}
