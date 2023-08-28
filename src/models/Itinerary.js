import { Schema, model, Types } from 'mongoose'

const ItinerarySchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    duration: { type: Number, required: true, min: 0 }, // in minutes
    price: { type: Number, required: true, min: 1, max: 5 }, // 1 = low, 5 = high
    _city: {
      type: Types.ObjectId,
      ref: 'City',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'UserDetail', // NO se usa 'User' no se neceista la contraseña etc, debemos recibir el id de User en controller
    },
    likes: {
      type: Number,
      default: 0,
    },
    hashtags: [{ type: String, required: true }],
    activities: [
      {
        type: Types.ObjectId,
        ref: 'Activity',
      },
    ],
    comments: [
      {
        type: Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
)

const Itinerary = model('Itinerary', ItinerarySchema, 'itineraries')

export default Itinerary
