const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shiftSchema = new Schema({
    movieId: String,
    screen: Number,
    time: String,
    selected: String
})

module.exports = mongoose.model('Shift', shiftSchema)