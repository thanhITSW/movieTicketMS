const express = require('express')
const Router = express.Router()

const Controller = require('../controller/movies-manage')

Router.get('/', Controller.UI)

Router.get('/movies', Controller.get_list_movie)

Router.get('/shifts', Controller.get_shift_movie)

Router.post('/shifts/add', Controller.add_shift)

Router.get('/shifts/delete', Controller.delete_shift)

Router.post('/movies/add', Controller.add_movie)

Router.post('/movies/edit', Controller.edit_movie)

Router.get('/movies/delete', Controller.delete_movie)

Router.get('/reviews', Controller.get_list_message)

Router.post('/changePassword', Controller.changePassword)

module.exports = Router