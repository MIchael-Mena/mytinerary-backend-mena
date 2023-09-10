import User from '../models/User.js'
import jsonResponse from '../utils/jsonResponse.js'

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    profilePic: user.profilePic,
    lastLogin: user.lastLogin,
    favouriteCities: user.favouriteCities,
    favouriteActivities: user.favouriteActivities,
    favouriteItineraries: user.favouriteItineraries,
  }
}

const register = async (req, res, next) => {
  try {
    const payload = req.body

    const user = new User(payload)
    await user.save()
    jsonResponse(true, res, 201, 'User created', getUserResponse(user))
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { lastLogin: Date.now() } }
    )

    jsonResponse(
      true,
      res,
      200,
      'User logged',
      getUserResponse(user),
      req.token
    )
  } catch (error) {
    next(error)
  }
}

export { register, login }
