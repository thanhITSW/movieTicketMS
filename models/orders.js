const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    creation_date: String,
    username: String,
    movieId: String,
    movieName: String,
    movieDate: String,
    screen: String,
    movieShift: String,
    quantity: String,
    selected: String,
    movieTotal: String,
})

module.exports = mongoose.model('Order', OrderSchema)