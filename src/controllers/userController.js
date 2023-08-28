import User from '../models/User.js'
import UserDetail from '../models/UserDetail.js'
import jsonResponse from '../utils/jsonResponse.js'

// TODO: Si usara typescript con una interfaz puedo evitar devolver la propiedad _user de userDetail
const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      surname,
      country,
      age,
      profilePic,
      favouriteActivities,
      favouriteCities,
      favouriteItineraries,
    } = req.body

    const newUserDetail = new UserDetail({
      name,
      surname,
      country,
      age,
      profilePic,
      favouriteActivities,
      favouriteCities,
      favouriteItineraries,
    })

    const validationError = newUserDetail.validateSync()
    const existingUser = await User.findOne({ email })

    if (existingUser)
      return jsonResponse(false, res, 400, 'Email already in use')
    else if (validationError)
      return jsonResponse(false, res, 400, validationError.message)

    const savedUser = await User.create({ email, password })
    newUserDetail._user = savedUser._id
    const savedUserDetails = await newUserDetail.save()

    await savedUser.updateOne({ userDetail: savedUserDetails })

    // const user = await User.findById(savedUser._id).populate('userDetail')
    let user = { ...savedUser.toObject(), userDetail: savedUserDetails }

    jsonResponse(true, res, 201, 'User created successfully', user)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('userDetail')

    if (!user) return jsonResponse(false, res, 404, 'User not found')

    jsonResponse(true, res, 200, 'User found', user)
  } catch (error) {
    next(error)
  }
}

const getUserDetail = async (req, res, next) => {
  try {
    const userDetail = await UserDetail.find({ _user: req.params.id })

    if (!userDetail)
      return jsonResponse(false, res, 404, 'User detail not found')

    jsonResponse(true, res, 200, 'User detail found', userDetail)
  } catch (error) {
    next(error)
  }
}

export { createUser, getUser, getUserDetail }
