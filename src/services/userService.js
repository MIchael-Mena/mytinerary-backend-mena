import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'
import User from '../models/User.js'

const getUserResponse = (user) => {
  return {
    id: user._id,
    // lastLogin: user.lastLogin,
    email: user.email,
    name: user.name,
    surname: user.surname,
    profilePic: user.profilePic,
    favouriteCities: user.favouriteCities,
    favouriteActivities: user.favouriteActivities,
    favouriteItineraries: user.favouriteItineraries,
  }
}

// Metodo usado internamente
const getUserByIdService = async (id) => {
  validateId(id, 'User')
  const user = await User.findById(id)

  if (!user) throw new NotFoundError(`User with id '${id}' not found.`)

  return user
}

const getUserByEmailService = async (email) => {
  const user = await User.findOne({ email })

  if (!user || !user.active)
    throw new NotFoundError(`User with email '${email}' not found.`)

  return user
}

const updateLoginStatusService = async (email, loginIsActive) => {
  const user = await User.updateOne(
    { email },
    loginIsActive
      ? { $set: { lastLogin: Date.now(), online: true } }
      : { $set: { online: false } }
  )
  // TODO: Lanzar excepción si no se ha modificado ningún usuario
  return user.modifiedCount > 0 ? true : false
}

const createUserService = async (payload) => {
  const user = new User(payload)
  await user.save()
  return getUserResponse(user)
}

const deleteAccountService = async (id) => {
  const user = await User.findByIdAndUpdate(id, {
    active: false,
    online: false,
  })
  if (!user) throw new NotFoundError(`User with id '${id}' not found.`)
  return user
}

export {
  getUserByIdService,
  getUserByEmailService,
  createUserService,
  updateLoginStatusService,
  getUserResponse,
  deleteAccountService,
}
