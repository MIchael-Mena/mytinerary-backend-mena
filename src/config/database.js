import mongoose from 'mongoose'

let uri = process.env.MONGO

mongoose
  .connect(uri)
  .then((db) => console.log('DB is connected'))
  .catch((err) => console.log(err))
