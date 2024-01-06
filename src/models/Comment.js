import { Schema, Types, model } from 'mongoose'

const CommentSchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 1000 },
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

/* const CommentSchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 1000 },
    _user: { type: Types.ObjectId, ref: 'User', required: true },
    _itinerary: { type: Types.ObjectId, ref: 'Itinerary', required: true },
  },
  { timestamps: true }
) */

const Comment = model('Comment', CommentSchema, 'comments')

export default Comment
