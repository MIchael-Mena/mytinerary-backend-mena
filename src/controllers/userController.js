import User from '../models/User.js'

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('accounts')
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const createUser = (req, res) => {
  const { name, email, lastName, age } = req.body
  const user = new User({ name, email, lastName, age })
  user
    .save()
    .then((user) => {
      res.status(201).json(user)
    })
    .catch((error) => {
      res.status(400).json({ message: error.message })
    })
}

export { getUser, createUser }
