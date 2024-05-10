const express = require('express')
const Router = express.Router()

const TickerController = require('../controller/ticket-booking')

Router.get('/', TickerController.shift)

Router.post('/', TickerController.getData)

Router.get('/select', TickerController.select)

Router.post('/select', TickerController.getSelect)

Router.post('/detail', TickerController.detail)

Router.get('/ticket', TickerController.showTicket)

module.exports = Router