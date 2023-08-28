import { Schema, Types, model } from 'mongoose'

const CitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    country: { type: String, required: true, maxlength: 100 },
    capital: { type: Boolean, required: true },
    population: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 10 },
    images: [{ type: String, required: true }],
    language: { type: String, required: true, maxlength: 100 },
    currency: { type: String, required: true, maxlength: 100 },
    religion: { type: String, required: true, maxlength: 100 },
    bestTime: { type: String, required: true, maxlength: 100 },
    timezone: { type: String, required: true, maxlength: 100 },
    itinerary: [{ type: Types.ObjectId, ref: 'Itinerary' }],
  },
  { timestamps: true }
)

const City = model('City', CitySchema, 'cities')

export default City
