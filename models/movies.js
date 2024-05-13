const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    director: String,
    des: String,
    date: String,
    genres: String,
    cast: String,
    time: String,
    url_video: String,
    audio: {
        type: String,
        default: 'English'
    },
    subTitle: String,
    minAge: Number,
    url_banner: String,
    status: {
        type: Number,
        default: 0 // 0: coming soon, 1: now showing, 2: end
    }
})

module.exports = mongoose.model('Movie', MovieSchema)