import User from '../models/User.js'
import jsonResponse from '../utils/jsonResponse.js'

//     const newUserDetail = new UserDetail({})
//     const validationError = newUserDetail.validateSync()
//     const savedUserDetails = await newUserDetail.save()
//     await savedUser.updateOne({ userDetail: savedUserDetails })
//     // const user = await User.findById(savedUser._id).populate('userDetail')
//     let user = { ...savedUser.toObject(), userDetail: savedUserDetails }

const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body)

    jsonResponse(true, res, 201, 'User created successfully', newUser)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) return jsonResponse(false, res, 404, 'User not found')

    jsonResponse(true, res, 200, 'User found', user)
  } catch (error) {
    next(error)
  }
}

export { createUser, getUser }
