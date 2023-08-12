import User from '../models/User.js'

const getUser = (req, res) => {
  const { id } = req.params
  const { name } = req.query
  res.send(`El id es ${id} y el nombre es ${name}`)
  // try {
  //   const client = await Client.findById(req.params.id)
  //   res.status(200).json(client)
  // } catch (error) {
  //   res.status(500).json({ message: error.message })
  // }
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
