const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: 'user'
    }
})

module.exports = mongoose.model('Account', AccountSchema)