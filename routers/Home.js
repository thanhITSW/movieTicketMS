const express = require('express')
const Router = express.Router()

const HomeController = require('../controller/Home')

Router.post('/signin', HomeController.signIn)

Router.get('/login', HomeController.login)

Router.post('/login', HomeController.postLogin)

Router.get('/logout', HomeController.logout)

Router.get('/', HomeController.home)

Router.get('/about', HomeController.about)

Router.get('/contact', HomeController.contact)

Router.post('/contact', HomeController.receive_message)

Router.post('/search', HomeController.search)

Router.get('/movies', HomeController.showMovie)

Router.post('/movies', HomeController.getData)

Router.get('/history', HomeController.historyBill)

Router.get('/changeInformation', HomeController.changeInformation)

Router.post('/changeInformation/change-password', HomeController.change_password)

Router.post('/changeInformation/update-information', HomeController.update_information)




module.exports = Router