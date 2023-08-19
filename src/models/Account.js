import { model, Schema } from 'mongoose'

const accountSchema = new Schema({
  number: {
    type: String,
    required: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Account = model('Account', accountSchema)

export default Account
