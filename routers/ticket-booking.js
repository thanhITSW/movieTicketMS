const express = require('express')
const Router = express.Router()

const TickerController = require('../controller/ticket-booking')

Router.get('/', TickerController.shift)

Router.post('/', TickerController.getData)

Router.get('/select', TickerController.select)

Router.post('/select', TickerController.getSelect)

Router.post('/detail', TickerController.detail)

Router.get('/ticket', TickerController.showTicket)

Router.get('/payment', TickerController.payment)

Router.post("/create_payment_url", TickerController.VNPay)

Router.get("/vnpay_return", TickerController.VNPayReturn)

module.exports = Router