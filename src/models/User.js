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
    userDetail: {
      type: Types.ObjectId,
      ref: 'UserDetail',
    },
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
