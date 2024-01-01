import { NotFoundError } from '../exceptions/NotFoundError.js'
import Itinerary from '../models/Itinerary.js'
import { getCityByIdService } from './cityService.js'
import { getUserByIdService } from './userService.js'
import { validateId } from './util.js'

// TODO: revisar que si se cambia el nombre de una propiedad en el modelo, se cambie también en el populate
// tal vez se pueda hacer un populate dinámico con un objeto que tenga como clave el nombre de la propiedad
const populateItinerary = [
  {
    path: '_city',
    select: 'name country',
  },
  {
    path: 'user',
    select: 'firstName lastName profilePic',
  },
]

const verifyItineraryExists = (id, itinerary) => {
  if (!itinerary)
    throw new NotFoundError(`Itinerary with id '${id}' not found.`)
}

const deleteItineraryService = async (id) => {
  validateId(id, 'Itinerary')
  const itinerary = await Itinerary.findByIdAndDelete(id)
  verifyItineraryExists(id, itinerary)

  return itinerary
}

const updateItineraryService = async (id, itinerary) => {
  validateId(id, 'Itinerary')
  const itineraryUpdated = await Itinerary.findByIdAndUpdate(id, itinerary, {
    new: true,
    runValidators: true,
  })
  verifyItineraryExists(id, itineraryUpdated)

  return itineraryUpdated
}

const getItineraryByIdService = async (id) => {
  validateId(id, 'Itinerary')
  const itinerary = await Itinerary.findById(id).populate(populateItinerary)

  verifyItineraryExists(id, itinerary)

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

const addLikeToItineraryService = async (itineraryId, userId) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  // verifico si el usuario ya tiene un like en este itinerario
  const { user, hasLiked } = await userHasLikedItineraryService(
    itineraryId,
    userId
  )
  if (hasLiked) {
    throw new Error('User already liked this itinerary.')
  }

  await user.updateOne({ $push: { favouriteItineraries: itineraryId } })

  // Al hacer esto me ahorro tener que estar calculando el total de likes cuando se pida un itinerario
  itinerary.likes++

  await itinerary.save()
}

const removeLikeFromItineraryService = async (itineraryId, userId) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  const { user, hasLiked } = await userHasLikedItineraryService(
    itineraryId,
    userId
  )
  if (!hasLiked) {
    throw new Error('User has not liked this itinerary.')
  }

  await user.updateOne({ $pull: { favouriteItineraries: itineraryId } })

  itinerary.likes--

  await itinerary.save()
}

const userHasLikedItineraryService = async (itineraryId, userId) => {
  const user = await getUserByIdService(userId)

  return {
    hasLiked: user.favouriteItineraries.includes(itineraryId),
    user,
  }
}

export {
  deleteItineraryService,
  updateItineraryService,
  getItineraryByIdService,
  getItinerariesByCityIdService,
  createItineraryService,
  createItinerariesService,
  addLikeToItineraryService,
  removeLikeFromItineraryService,
  userHasLikedItineraryService,
}
