import { Schema, Types, model } from 'mongoose'

// Este Schema representaria información adicional publica del usuario y que no requiere de autenticación
const UserDetailSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  surname: { type: String, required: true, maxlength: 100 },
  country: { type: String, required: true, maxlength: 100 },
  age: { type: Number, required: true, min: 0, max: 120 },
  profilePic: String, // NO se uso required porque toma como inválido un campo vacío ''
  favouriteCities: [String],
  favouriteActivities: [String],
  favouriteItineraries: [String],
  _user: {
    type: Schema.Types.ObjectId, // Tambien se puede usar solo Types.ObjectId
    ref: 'User',
  },
})

const UserDetail = model('UserDetail', UserDetailSchema, 'userDetails')

export default UserDetail
