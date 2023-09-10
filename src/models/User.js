import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    name: String,
    surname: String,
    country: String,
    birthDate: Date,
    profilePic: String,
    favouriteCities: [String],
    favouriteActivities: [String],
    favouriteItineraries: [String],
    role: String,
    active: Boolean,
    online: Boolean,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
)

const User = model('User', UserSchema)

export default User

// Schema alternativa con validaciones de mongoose
// const UserSchema = new Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       maxlength: 100,
//     },
//     password: {
//       type: String,
//       required: true,
//       validate: {
//         validator: function (value) {
//           return value.length >= 6
//         },
//         message: 'Password must be at least 6 characters long',
//       },
//     },
//     name: { type: String, required: true, maxlength: 100 },
//     surname: { type: String, required: true, maxlength: 100 },
//     country: { type: String, required: true, maxlength: 100 },
//     birthDate: { type: Date, required: true },
//     profilePic: { type: String, default: '' }, // NO se uso required porque toma como inválido un campo vacío ''
//     favouriteCities: [String],
//     favouriteActivities: [String],
//     favouriteItineraries: [String],
//     role: {
//       type: String,
//       enum: ['admin', 'user'],
//       default: 'user',
//     },
//     active: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// )

// Ejemplo de como usar la validacion de mongoose
//     const newUserDetail = new UserDetail({})
//     const validationError = newUserDetail.validateSync()
//     const savedUserDetails = await newUserDetail.save()
//     await savedUser.updateOne({ userDetail: savedUserDetails })
//     // const user = await User.findById(savedUser._id).populate('userDetail')
//     let user = { ...savedUser.toObject(), userDetail: savedUserDetails }

// Tambien se puede usar el metodo validate de mongoose para validar un objeto
// Otra forma es en cualquier metodo que interactue con la base de datos agregar
// al segundo parametro { runValidators: true } para que valide el objeto antes de
// guardarlo en la base de datos (en el caso de que se haya modificado el objeto)
// Ejemplo:
// const user = await User.findByIdAndUpdate(
//   req.params.id,
//   req.body,
//   { runValidators: true }
// )
