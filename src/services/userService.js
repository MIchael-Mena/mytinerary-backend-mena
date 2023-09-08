import { NotFoundError } from '../exceptions/NotFoundError.js'
import { validateId } from './util.js'
import User from '../models/User.js'

const getUserByIdService = async (id) => {
  validateId(id, 'User')
  const user = User.findById(id)

  if (!user) throw new NotFoundError(`User with id '${id}' not found.`)

  return user
}

export { getUserByIdService }
