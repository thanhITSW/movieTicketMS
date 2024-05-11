const express = require('express')
const Router = express.Router()

const Controller = require('../controller/movies-manage')

Router.get('/', Controller.UI)

Router.get('/movies', Controller.get_list_movie)

module.exports = Router