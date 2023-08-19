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
    // location: {
    //   lat: { type: Number, required: true },
    //   long: { type: Number, required: true },
    // },
    // weather: {
    //   temp: { type: Number, required: true },
    //   wind: { type: Number, required: true },
    //   humidity: { type: Number, required: true },
    //   description: { type: String, required: true },
    // },
    // activities: [{ type: Types.ObjectId, ref: "Activity" }],
    // itinerary: [{ type: Types.ObjectId, ref: "Itinerary" }],
  },
  { timestamps: true }
)

const City = model('City', CitySchema, 'cities')

export default City
