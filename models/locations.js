const mongoose = require('mongoose')
const Schema = mongoose.Schema

const locationsSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['hospital', 'police', 'safehouse'], required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    hours: { type: String, required: true },
    is_24_hour: { type: Boolean, required: true }
},{timestamps: true})

//This converts our schema to a model
const locations = mongoose.model('locations', locationsSchema)

module.exports = locations