const getClient = (req, res) => {
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

module.exports = {
  getClient,
}
