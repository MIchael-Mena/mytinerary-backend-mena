import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'
import User from '../models/User.js'

const getUserResponse = (user) => {
  return {
    id: user._id,
    // lastLogin: user.lastLogin,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePic: user.profilePic,
    favouriteCities: user.favouriteCities,
    favouriteActivities: user.favouriteActivities,
    favouriteItineraries: user.favouriteItineraries,
  }
}

const verifyUserIsActive = (id, user, idText = 'id') => {
  // if (!user || !user.active) {
  //   throw new NotFoundError(
  //     `User with ${idText} '${id}' not found or inactive.`
  //   )
  // }
  if (!user) throw new NotFoundError(`User with ${idText} '${id}' not found.`)

  if (user && !user.active)
    throw new NotFoundError(`User with ${idText} '${id}' is inactive.`)
}

// Metodo usado internamente
const getUserByIdService = async (id) => {
  validateId(id, 'User')
  const user = await User.findById(id)
  verifyUserIsActive(id, user)

  return user
}

const getUserByEmailService = async (email) => {
  const user = await User.findOne({ email })
  verifyUserIsActive(email, user, 'email')

  return user
}

// @param loginState: true si se loguea, false si se desloguea
const updateLoginStatusService = async (email, loginState) => {
  const user = await User.updateOne(
    { email },
    loginState
      ? { $set: { lastLogin: Date.now(), online: true } }
      : { $set: { online: false } }
  )
  if (user.modifiedCount === 0)
    throw new Error(`User with email '${email}' not modified.`)
}

const createUserService = async (payload) => {
  const user = new User(payload)
  await user.save()
  return getUserResponse(user)
}

const deleteAccountService = async (id) => {
  validateId(id, 'User')
  const user = await User.findByIdAndUpdate(id, {
    active: false,
    online: false,
  })
  verifyUserIsActive(id, user)
}

export {
  getUserByIdService,
  getUserByEmailService,
  createUserService,
  updateLoginStatusService,
  getUserResponse,
  deleteAccountService,
}
