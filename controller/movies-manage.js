const Movie = require('../models/movies')
const Message = require('../models/message')

module.exports.UI =  (req, res) => {
    res.render('movie-manage')
}

module.exports.get_list_movie = (req, res) => {

    Movie.find()
        .then(listMovie => {
            return res.json({ code: 0, listMovie })
        })
        .catch(err => {
            return res.json({ code: 1, message: "Search movies failed" })
        })
}

module.exports.add_movie = (req, res) => {
    const { name, director, description, date, genres, cast, time, url_video, url_banner, status } = req.body

    if(!name || !director || !description || !date || !genres || !cast || !time || !url_video || !url_banner || !status) {
        return res.json({ code: 1, message: "Please provide full information" })
    }

    let movie = new Movie({
        name, director, des: description, date, genres, cast, time, url_video, url_banner, status
    })

    movie.save()
        .then(() => {
            return res.json({ code: 0, message: 'Add movie successfully' })
        })
        .catch(e => {
            if (e.message.includes('name')) {
                return res.json({ code: 1, message: 'Name already exists' })
            }

            return res.json({ code: 1, message: 'Add failed, an error has occurred' })
        })
}

module.exports.edit_movie = (req, res) => {
    const id = req.query.id
    const { name, director, description, date, genres, cast, time, url_video, url_banner, status } = req.body

    if (!id) {
        return res.json({ code: 1, message: "Please provide movie Id" })
    }

    if(!name || !director || !description || !date || !genres || !cast || !time || !url_video || !url_banner || !status) {
        return res.json({ code: 1, message: "Please provide full information" })
    }

    let dataUpdate = {
        name, director, des: description, date, genres, cast, time, url_video, url_banner, status
    }
    let supportedFields = ['name', 'director', 'des', 'date', 'genres', 'cast', 'time', 'url_video', 'url_banner', 'status']

    for (field in dataUpdate) {
        if (!supportedFields.includes(field)) {
            delete dataUpdate[field]
        }
    }

    Movie.findByIdAndUpdate(id, dataUpdate, {new: true})
        .then(movie => {
            if (!movie) {
                return res.json({ code: 1, message: "Id not found" })
            }

            return res.json({ code: 0, message: 'Update movie successfully' })
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 1, message: "Invalid Id" })
            }
            else if (e.message.includes('name')) {
                return res.json({ code: 1, message: 'Name already exists' })
            }

            return res.json({ code: 1, message: 'Add failed, an error has occurred' })
        })
}

module.exports.delete_movie = (req, res) => {
    const id = req.query.id

    if (!id) {
        return res.json({ code: 1, message: "Please provide movie Id" })
    }

    Movie.findByIdAndDelete(id)
        .then(movie => {
            if (!movie) {
                return res.json({ code: 1, message: "Id not found" })
            }

            return res.json({ code: 0, message: `Delete movie successfully (${movie.name})` })
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 1, message: "Invalid Id" })
            }
            return res.json({ code: 1, message: "Delete failed, An error has occurred" })
        })
}

module.exports.get_list_message = (req, res) => {

    Message.find()
        .then(listMessage => {
            return res.json({ code: 0, listMessage })
        })
        .catch(err => {
            return res.json({ code: 1, message: "Search messages failed" })
        })
}