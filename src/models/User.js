import { Schema, Types, model } from 'mongoose'

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 18, max: 65 },
    accounts: [{ type: Types.ObjectId, ref: 'Account' }],
  },
  { timestamps: true }
)

const User = model('User', UserSchema)

export default User
