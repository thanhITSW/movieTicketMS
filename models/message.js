const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    message: String,
})

module.exports = mongoose.model('Message', MessageSchema)