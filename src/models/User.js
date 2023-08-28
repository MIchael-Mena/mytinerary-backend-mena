import { Schema, Types, model } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 6
        },
        message: 'Password must be at least 6 characters long',
      },
    },
    name: { type: String, required: true, maxlength: 100 },
    surname: { type: String, required: true, maxlength: 100 },
    country: { type: String, required: true, maxlength: 100 },
    age: { type: Number, required: true, min: 0, max: 120 },
    profilePic: String, // NO se uso required porque toma como inválido un campo vacío ''
    favouriteCities: [String],
    favouriteActivities: [String],
    favouriteItineraries: [String],
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const User = model('User', UserSchema)

export default User
