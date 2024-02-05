import { NotFoundError } from '../exceptions/NotFoundError.js'
import Itinerary from '../models/Itinerary.js'
import { getCityByIdService } from './cityService.js'
import { getUserByIdService } from './userService.js'
import { validateId } from './util.js'
import Activity from '../models/Activity.js'
import City from '../models/City.js'
import { InvalidFieldError } from '../exceptions/InvalidFieldError.js'
import {
  deleteCommentService,
  deleteCommentsByItineraryIdService,
} from './commentService.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'

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

  // validateId(id, 'Itinerary')
  // const itinerary = await Itinerary.findById(id).populate(populateItinerary)

  // verifyItineraryExists(id, itinerary)

  // return itinerary
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

const deleteItineraryServiceAlternative = async (id) => {
  validateId(id, 'Itinerary')
  const itinerary = await Itinerary.findByIdAndDelete(id)
  verifyItineraryExists(id, itinerary)

  await City.updateOne({ _id: itinerary._city }, { $pull: { itineraries: id } })

  // Elimino las actividades del itinerario, lo puedo hacer de esta forma ya que no hay referencia a otra coleccion
  await Activity.deleteMany({ _id: { $in: itinerary.activities } })

  // Primero, obténgo los comentarios por su ID
  const comments = await Comment.find({ _id: { $in: itinerary.comments } })
  // Luego, extraigo los IDs de usuario de los comentarios
  const userIds = comments.map((comment) => comment._user)
  // Borrar todos los comentarios del itinerario
  await Comment.deleteMany({ _id: { $in: itinerary.comments } })
  // Finalmente, actualizo los documentos de usuario
  await User.updateMany(
    { _id: { $in: userIds } }, // Filtra los usuarios que tienen un comentario en el itinerario
    { $pull: { comments: { $in: itinerary.comments } } } // Elimina la referencia al comentario
  )
  return itinerary
}

const deleteItinerariesByCityIdService = async (cityId) => {
  const city = await getCityByIdService(cityId, false)

  const { itineraries } = city

  if (itineraries.length === 0)
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

const verifyItineraryData = (itinerariesData) => {
  // Se podria usar el schema de Joi para validar los datos
  const hasActivities = itinerariesData.some(
    (itinerary) => itinerary.activities && itinerary.activities.length > 0
  )

  const hasComments = itinerariesData.some(
    (itinerary) => itinerary.comments && itinerary.comments.length > 0
  )

  if (hasComments)
    throw new InvalidFieldError(
      'Itineraries cannot have comments. Use the comment endpoint to add comments.'
    )

  if (hasActivities)
    throw new InvalidFieldError(
      'Itineraries cannot have activities. Use the activity endpoint to add activities.'
    )

  if (itinerariesData.duration && itinerariesData.duration !== 0)
    throw new InvalidFieldError(
      'Duration initial value must be 0. It will update automatically when activities are added.'
    )
}

const createItinerariesService = async (itinerariesData, userId) => {
  // TODO: Mejorar el caso en el que se encuntra un error con un id de ciudad y previamente
  // se crearon itinerarios, se deberia avisar que se crearon algunos itinerarios
  // o no permitir la creación de ninguno (ver transacciones)
  verifyItineraryData(itinerariesData)

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

const addLikeToItineraryService = async (itineraryId, userId) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  // verifico si el usuario ya tiene un like en este itinerario
  const { user, hasLiked } = await userHasLikedItineraryService(
    itineraryId,
    userId
  )
  if (hasLiked) {
    throw new InvalidFieldError('User already liked this itinerary.', 409)
  }

  await user.updateOne({ $push: { favouriteItineraries: itineraryId } })

  // Al hacer esto me ahorro tener que estar calculando el total de likes cuando se pida un itinerario
  itinerary.likes++

  await itinerary.save()
  return { totalLikes: itinerary.likes, user }
}

const removeLikeFromItineraryService = async (itineraryId, userId) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  const { user, hasLiked } = await userHasLikedItineraryService(
    itineraryId,
    userId
  )
  if (!hasLiked) {
    throw new InvalidFieldError('User has not liked this itinerary.', 409)
  }

  await user.updateOne({ $pull: { favouriteItineraries: itineraryId } })

  itinerary.likes--

  await itinerary.save()
  return { totalLikes: itinerary.likes, user }
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
  deleteItinerariesByCityIdService,
}
