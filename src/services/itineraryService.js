import { NotFoundError } from '../exceptions/NotFoundError.js'
import Itinerary from '../models/Itinerary.js'
import { getCityByIdService } from './cityService.js'
import { validateId } from './util.js'
import Activity from '../models/Activity.js'
import City from '../models/City.js'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'
import { deleteCommentService } from './commentService.js'

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
  {
    path: 'comments', // Lo agrege para probar el populate de comentarios
    select: 'text',
  },
]

const getItineraryByIdService = async (id, shouldPopulate = false) => {
  validateId(id, 'Itinerary')

  const itinerary = await Itinerary.findById(id)

  verifyItineraryExists(id, itinerary)

  if (shouldPopulate) await itinerary.populate(populateItinerary)

  return itinerary
}

const getItinerariesByCityIdService = async (cityId) => {
  await getCityByIdService(cityId, false)
  const itineraries = await Itinerary.find({ _city: cityId }).populate(
    populateItinerary
  )
  return itineraries
}

const verifyItineraryExists = (id, itinerary) => {
  if (!itinerary)
    throw new NotFoundError(`Itinerary with id '${id}' not found.`)
}

const deleteItineraryService = async (id) => {
  const itinerary = await getItineraryByIdService(id)
  await City.updateOne({ _id: itinerary._city }, { $pull: { itineraries: id } })
  await Activity.deleteMany({ _id: { $in: itinerary.activities } })
  // Este metodo elimina la referencia en el usuario y el itinerario que ya no existe,
  // por la tanto se debe ejecutar antes de eliminar el itinerario
  itinerary.comments.forEach(
    async (commentId) => await deleteCommentService(commentId)
  )
  await itinerary.deleteOne()
}

const deleteItinerariesByCityIdService = async (
  cityId,
  throwIfEmpty = true
) => {
  const city = await getCityByIdService(cityId, false)

  const { itineraries } = city

  if (itineraries.length === 0 && throwIfEmpty)
    throw new NotFoundError('There are no itineraries to delete for this city.')

  itineraries.forEach(
    async (itineraryId) => await deleteItineraryService(itineraryId)
  )

  return city
}

const updateItineraryService = async (id, itinerary) => {
  // TODO: activities y comment se deben actualizar en sus respectivos endpoints, no en este
  validateId(id, 'Itinerary')
  const itineraryUpdated = await Itinerary.findByIdAndUpdate(id, itinerary, {
    new: true,
    runValidators: true,
  })
  verifyItineraryExists(id, itineraryUpdated)

  return itineraryUpdated
}

const createItineraryService = async (itineraryData) => {
  // Este metodo solo lo usa createItinerariesService que se encarga de las verificaciones
  const itinerary = (await Itinerary.create(itineraryData)).populate(
    populateItinerary
  )
  return itinerary
}

const createItinerariesService = async (itinerariesData, userId) => {
  // TODO: Mejorar el caso en el que se encuntra un error con un id de ciudad y previamente
  // se crearon itinerarios, se deberia avisar que se crearon algunos itinerarios
  // o no permitir la creación de ninguno (ver transacciones)
  const itineraries = []
  for (const itineraryData of itinerariesData) {
    const { _city } = itineraryData

    const cityFounded = await getCityByIdService(_city)

    const itineraryToCreate = {
      ...itineraryData,
      user: userId,
    }

    const newItinerary = await createItineraryService(itineraryToCreate)

    cityFounded.itineraries.push(newItinerary.id)
    await cityFounded.save()

    itineraries.push(newItinerary)
  }
  return Promise.all(itineraries)
}

const updateLikeOnItineraryService = async (
  itineraryId,
  user,
  isAddingLike,
  updateUserFavourites
) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  const hasLiked = user.favouriteItineraries.includes(itineraryId)

  if ((!isAddingLike && !hasLiked) || (isAddingLike && hasLiked)) {
    const errorMessage = isAddingLike
      ? 'User already liked this itinerary.'
      : 'User has not liked this itinerary.'
    throw new InvalidFieldError(errorMessage, 409)
  }

  await user.updateOne(updateUserFavourites(itineraryId))

  isAddingLike ? itinerary.likes++ : itinerary.likes--

  await itinerary.save()
  return { totalLikes: itinerary.likes }
}

const addLikeToItineraryService = async (itineraryId, user) => {
  return updateLikeOnItineraryService(
    itineraryId,
    user,
    true,
    (itineraryId) => ({ $push: { favouriteItineraries: itineraryId } })
  )
}

const removeLikeFromItineraryService = async (itineraryId, user) => {
  return updateLikeOnItineraryService(
    itineraryId,
    user,
    false,
    (itineraryId) => ({ $pull: { favouriteItineraries: itineraryId } })
  )
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
  deleteItinerariesByCityIdService,
}
