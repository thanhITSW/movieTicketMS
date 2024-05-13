const mongoose = require('mongoose')
const Schema = mongoose.Schema

const screenSchema = new Schema({
    screen: Number,
    row: Number,
    column: Number,
})

module.exports = mongoose.model('Screen', screenSchema)