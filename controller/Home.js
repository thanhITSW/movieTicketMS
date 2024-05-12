const Movie = require('../models/movies')
const Order = require('../models/orders')
const Account = require('../models/account')
const Message = require('../models/message')
const validator = require('../validators/Account')
const bcrypt = require('bcrypt')



module.exports.signIn = (req, res) => {
    const {signUpName, signUpEmail, signUpPassword} = req.body

    const hashed = bcrypt.hashSync(signUpPassword, 5)

    let account = new Account({name: signUpName, email: signUpEmail, password: hashed})

    account.save()
        .then(() => {
            setTimeout(() => {
                res.redirect('/login');
            }, 2000);
        })
        .catch(e => {
            if (e.message.includes('email')) {
                req.flash('errorMessage', 'Email already exists')
            }
            else {
                req.flash('errorMessage', 'Add failed, an error has occurred')
            }
            res.redirect('/login')
        })
}

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
            return res.redirect('/movie-manage');
        })
        .catch(e => {
            if(account) {
                req.flash('errorMessage', 'Login failed')
                return res.redirect('/login')
            }
        })
}

module.exports.home =  (req, res) => {
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

module.exports.search = (req, res) => {
    const {search} = req.body
    req.session.search = search
    req.flash('search', search)
    res.redirect('/movies')
}

module.exports.showMovie =  (req, res) => {

    let email = ''
    const user = req.session.user
    if(user){
        email = user.email
    }
    const search = req.session.search || ''
    const status = req.session.status
    Movie.find()
        .then(movies => {
            res.render('movies', {movies, status, search, email})
        })
}

module.exports.getData = (req, res) => {
    const data = req.body
    req.session.status = data.status
    res.redirect('/movies')
}

module.exports.historyBill = (req, res) => {

    let username = ''
    const user = req.session.user
    if(!user){
        res.redirect('/login')
    }
    else {
        username = user.email
        Order.find()
            .then(orders => {
                res.render('history', {orders, username})
            })
    }
}

module.exports.about = (req, res) => {
    let email = ''
    const user = req.session.user
    if(user){
        email = user.email
    }
    res.render('about', {email})
}

module.exports.contact = (req, res) => {
    let email = ''
    const user = req.session.user
    if(user){
        email = user.email
    }
    res.render('contact', {email})
}

module.exports.changeInformation = (req, res) => {

    const user = req.session.user
    const errorMessage = req.flash('errorMessage') || ''
    const successMessage = req.flash('successMessage') || ''
    res.render('changeInformation', {user, errorMessage, successMessage})
}

module.exports.change_password = (req, res) => {

    const { id, password } = req.body

    if (!id) {
        req.flash('errorMessage', 'Please provide id employee')
        res.redirect('/changeInformation')
    }

    const hashed = bcrypt.hashSync(password, 5)

    let dataUpdate = {
        password: hashed
    }

    Account.findByIdAndUpdate(id, dataUpdate, {
        new: true
    })
        .then(a => {
            if (!a) {
                req.flash('errorMessage', 'Id not found: ' + id)
            }
            else {
                req.flash('successMessage', 'Change password success')
            }
            req.session.user = a
            res.redirect('/changeInformation');
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                req.flash('errorMessage', 'Invalid Id')
            }
            else {
                req.flash('errorMessage', 'Change password failed, An error has occurred' + e.message)
            }
            res.redirect('/changeInformation')
        })
}

module.exports.update_information = (req, res) => {

    const { id, fullname, email} = req.body

    const error = validator(fullname, email)
    if (error !== '') {
        req.flash('errorMessage', error)
        return res.redirect('/changeInformation')
    }

    let name = fullname

    let dataUpdate = {
        name, email
    }
    let supportedFields = ['name', 'email']

    for (field in dataUpdate) {
        if (!supportedFields.includes(field)) {
            delete dataUpdate[field]
        }
    }

    Account.findByIdAndUpdate(id, dataUpdate, {
        new: true
    })
        .then(a => {
            if (!a) {
                req.flash('errorMessage', 'Id not found: ' + id)
            }
            else {
                req.flash('successMessage', 'Update success')
            }
            req.session.user = a
            res.redirect('/changeInformation')
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                req.flash('errorMessage', 'Invalid Id')
            }
            else if (e.message.includes('email')) {
                req.flash('errorMessage', 'Email already exists')
            }else {
                req.flash('errorMessage', 'Update failed, an error has occurred')
            }
            res.redirect('/changeInformation')
        })
}

module.exports.receive_message = (req, res) => {
    const {firstName, lastName, email, mobile, message} = req.body

    let msg = new Message({firstName, lastName, email, mobile, message})

    msg.save()
        .then(() => {
            setTimeout(() => {
                res.redirect('/contact');
            }, 2000); // 2 giây
        })
        .catch(e => {
            req.flash('errorMessage', 'Message sent failed, an error has occurred')
            res.redirect('/contact')
        })
}