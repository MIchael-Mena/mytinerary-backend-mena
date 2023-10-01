import {
  createUserService,
  deleteAccountService,
  getUserResponse,
  updateLoginStatusService,
} from '../services/userService.js'
import jsonResponse from '../utils/jsonResponse.js'

const register = async (req, res, next) => {
  try {
    const user = await createUserService(req.body)

    jsonResponse(
      true,
      res,
      201,
      'User created successfully!',
      getUserResponse(user),
      req.token ?? null
    )
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    await updateLoginStatusService(req.user.email, true)

    jsonResponse(
      true,
      res,
      200,
      'User logged in successfully!',
      getUserResponse(req.user),
      req.token
    )
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    await updateLoginStatusService(req.user.email, false)
    jsonResponse(true, res, 200, 'User logged out')
  } catch (error) {
    next(error)
  }
}

const authenticate = async (req, res, next) => {
  try {
    jsonResponse(
      true,
      res,
      200,
      'User authenticated',
      getUserResponse(req.user),
      req.token
    )
  } catch (error) {
    next(error)
  }
}

const deleteAccount = async (req, res, next) => {
  try {
    deleteAccountService(req.user._id)
    jsonResponse(
      true,
      res,
      200,
      'User deleted successfully',
      getUserResponse(req.user)
    )
  } catch (error) {
    next(error)
  }
}

export { register, login, authenticate, logout, deleteAccount }
