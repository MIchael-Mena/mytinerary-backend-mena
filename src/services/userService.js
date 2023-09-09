import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'
import User from '../models/User.js'

const getUserByIdService = async (id) => {
  validateId(id, 'User')
  const user = await User.findById(id)

  if (!user) throw new NotFoundError(`User with id '${id}' not found.`)

  return user
}

const getUserByEmailService = async (email) => {
  const user = await User.findOne({ email })

  if (!user) throw new NotFoundError(`User with email '${email}' not found.`)

  return user
}

const getUserDetailService = async (id) => {
  validateId(id, 'User')
  const user = await User.findById(id)

  if (!user) throw new NotFoundError(`User with id '${id}' not found.`)

  return {
    id: user._id,
    name: user.name,
    surname: user.surname,
    favouriteCities: user.favouriteCities,
    favouriteActivities: user.favouriteActivities,
    favouriteItineraries: user.favouriteItineraries,
    profilePic: user.profilePic,
  }
}

export { getUserByIdService, getUserDetailService, getUserByEmailService }
