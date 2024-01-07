import { Types, Schema, model } from 'mongoose'

const ActivitySchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    duration: { type: Number, required: true, min: 0 }, // in minutes
    description: { type: String, required: true, maxlength: 1000 },
    _itinerary: {
      type: Types.ObjectId,
      ref: 'Itinerary',
      required: true,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
)

const Activity = model('Activity', ActivitySchema, 'activities')

export default Activity
