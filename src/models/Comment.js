import { Schema, Types, model } from 'mongoose'

const CommentSchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 500 },
    _user: { type: Types.ObjectId, ref: 'User', required: true },
    _reference: { type: Types.ObjectId, refPath: 'onModel', required: true },
    onModel: {
      type: String,
      required: true,
      enum: ['Itinerary'],
    },
  },
  { timestamps: true }
)

const Comment = model('Comment', CommentSchema, 'comments')

export default Comment
