import { Schema, model, Types } from 'mongoose'

const ItinerarySchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    duration: {
      type: Number,
      default: 0,
      /*       validate: {
        // No lo uso ya que se ejecuta tanto con el metodo create como en save y no quiero que se ejecute en save
        validator: (value) => value === 0,
        message:
          'Initial duration must be 0. It will be updated when activities are added.',
      }, */
    }, // in minutes
    price: { type: Number, required: true, min: 1, max: 5 }, // 1 = low, 5 = high
    _city: {
      type: Types.ObjectId,
      ref: 'City',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
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

// El tercer parametro indica el nombre de la coleccion en la base de datos
const Itinerary = model('Itinerary', ItinerarySchema, 'itineraries')

export default Itinerary
