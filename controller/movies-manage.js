const Movie = require('../models/movies')

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
        name, director, description, date, genres, cast, time, url_video, url_banner, status
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