const Movie = require('../models/movies')
const Order = require('../models/orders')
const Account = require('../models/account')
const bcrypt = require('bcrypt')

module.exports.login = (req, res) => {
    if(req.session.user) {
        return res.redirect('/')
    }

    const errorMessage = req.flash('errorMessage') || ''
    let email = req.flash('email') || ''
    let password = req.flash('password') || ''

    const {email: queryEmail} = req.query

    if(queryEmail) {
        email = queryEmail
        password = queryEmail
    }
    res.render('sign_in', { errorMessage, email, password})
}

module.exports.logout = (req, res) => {
    req.session.destroy()

    res.redirect('/')
}

module.exports.postLogin = (req, res) => {

    let { email, password} = req.body
    console.log(email)
    console.log(password)
    
    let account = undefined
    req.flash('email', email)
    req.flash('password', password)

    Account.findOne({ email: email })
        .then(acc => {
            if (!acc) {
                req.flash('errorMessage', 'Account does not exist')
                return res.redirect('/login')
            }
            account = acc
            return bcrypt.compare(password, acc.password)
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                req.flash('errorMessage', 'Incorrect password')
                return res.redirect('/login')
            }

            if(account.role == 'user') {
                req.session.user =  account
                return res.redirect('/')
            }

            req.session.user =  account
            return res.redirect('/');
        })
        .catch(e => {
            if(account) {
                req.flash('errorMessage', 'Login failed')
                return res.redirect('/login')
            }
        })
}

module.exports.home =  (req, res) => {
    const status = req.session.user
    console.log(status)
    Movie.find()
        .then(movies => {
            if(req.session.user){
                res.render('Home', {movies})
            }
            else{
                res.render('indexNoLogin', {movies})
            }
        })
}

module.exports.showMovie =  (req, res) => {
    const status = req.session.status
    Movie.find()
        .then(movies => {
            res.render('movies', {movies, status})
        })
}

module.exports.getData = (req, res) => {
    const data = req.body
    req.session.status = data.status
    res.redirect('/movies')
}

module.exports.historyBill = (req, res) => {

    username = "tanthanh"
    Order.find()
        .then(orders => {
            res.render('history', {orders, username})
        })
}

module.exports.about = (req, res) => {
    res.render('about')
}

module.exports.contact = (req, res) => {
    res.render('contact')
}

