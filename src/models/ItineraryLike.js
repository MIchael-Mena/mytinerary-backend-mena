import { Types, Schema, model } from 'mongoose'

const ItineraryLikeSchema = new Schema({
  _itinerary: {
    type: Types.ObjectId,
    ref: 'Itinerary',
    required: true,
  },
  _user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const ItineraryLike = model(
  'ItineraryLike',
  ItineraryLikeSchema,
  'itineraryLikes'
)

export default ItineraryLike
