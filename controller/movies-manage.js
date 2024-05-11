const Movie = require('../models/movies')
const Message = require('../models/message')
const multer = require('multer')
const fs = require('fs');
const path = require('path');

const upload = multer({
    dest: path.join(__dirname, '..', 'assets', 'images'),
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true)
        }
        else callback(null, false)
    }, limits: { fileSize: 500000 }
}) // 500kb max

module.exports.UI = (req, res) => {
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

    let uploader = upload.single('banner')
    uploader(req, res, err => {

        var { name, director, description, date, genres, cast, time, url_video, url_banner, status } = req.body

        if (!name || !director || !description || !date || !genres || !cast || !time || !url_video || !url_banner || !status) {
            return res.json({ code: 1, message: "Please provide full information" })
        }

        var banner = req.file

        if (!banner) {
            return res.json({ code: 1, message: "Please provide banner image" })
        }

        let movie = new Movie({
            name, director, des: description, date, genres, cast, time, url_video, url_banner, status
        })

        movie.save()
            .then(() => {
                const oldImagePath = path.join(__dirname, '..', 'assets', 'images', banner.filename);
                const newImagePath = path.join(__dirname, '..', 'assets', 'images', url_banner + '.jpg');
                fs.renameSync(oldImagePath, newImagePath);

                return res.json({ code: 0, message: 'Add movie successfully' })
            })
            .catch(e => {
                const imagePath = path.join(__dirname, '..', 'assets', 'images', banner.filename);
                fs.unlinkSync(imagePath)

                if (e.message.includes('name')) {
                    return res.json({ code: 1, message: 'Name already exists' })
                }

                return res.json({ code: 1, message: 'Add failed, an error has occurred' })
            })
    })
}

module.exports.edit_movie = (req, res) => {

    let uploader = upload.single('banner')
    uploader(req, res, err => {

        const id = req.query.id
        var { name, director, description, date, genres, cast, time, url_video, url_banner, status } = req.body

        if (!id) {
            return res.json({ code: 1, message: "Please provide movie Id" })
        }

        if (!name || !director || !description || !date || !genres || !cast || !time || !url_video || !url_banner || !status) {
            return res.json({ code: 1, message: "Please provide full information" })
        }

        var banner = req.file

        let dataUpdate = {
            name, director, des: description, date, genres, cast, time, url_video, url_banner, status
        }
        let supportedFields = ['name', 'director', 'des', 'date', 'genres', 'cast', 'time', 'url_video', 'url_banner', 'status']

        for (field in dataUpdate) {
            if (!supportedFields.includes(field)) {
                delete dataUpdate[field]
            }
        }

        Movie.findByIdAndUpdate(id, dataUpdate, { new: false })
            .then(oldMovie => {
                if (!oldMovie) {
                    return res.json({ code: 1, message: "Id not found" })
                }

                let oldImagePath = path.join(__dirname, '..', 'assets', 'images', oldMovie.url_banner + '.jpg');
                const newImagePath = path.join(__dirname, '..', 'assets', 'images', url_banner + '.jpg');

                if(banner) {
                    fs.unlinkSync(oldImagePath)
                    oldImagePath = path.join(__dirname, '..', 'assets', 'images', banner.filename);
                }

                fs.renameSync(oldImagePath, newImagePath);

                return res.json({ code: 0, message: 'Update movie successfully' })
            })
            .catch(e => {
                if (banner) {
                    const imagePath = path.join(__dirname, '..', 'assets', 'images', banner.filename);
                    fs.unlinkSync(imagePath)
                }

                if (e.message.includes('Cast to ObjectId failed')) {
                    return res.json({ code: 1, message: "Invalid Id" })
                }
                else if (e.message.includes('name')) {
                    return res.json({ code: 1, message: 'Name already exists' })
                }

                return res.json({ code: 1, message: 'Add failed, an error has occurred' })
            })
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

            const { url_banner } = movie
            if (url_banner !== 'default_banner') {
                const imagePath = path.join(__dirname, '..', 'assets', 'images', url_banner + '.jpg');
                fs.unlinkSync(imagePath)
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