const express = require('express')
const Router = express.Router()

const HomeController = require('../controller/Home')

Router.get('/login', HomeController.login)

Router.post('/login', HomeController.postLogin)

Router.get('/', HomeController.home)

Router.get('/about', HomeController.about)

Router.get('/contact', HomeController.contact)

Router.get('/movies', HomeController.showMovie)

Router.post('/movies', HomeController.getData)

Router.get('/history', HomeController.historyBill)


module.exports = Router