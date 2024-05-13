const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    creation_date: String,
    email: String,
    movieId: String,
    movieName: String,
    movieDate: String,
    screen: String,
    movieShift: String,
    quantity: String,
    selected: String,
    movieTotal: String,
    paymentMethod: String,
})

module.exports = mongoose.model('Order', OrderSchema)