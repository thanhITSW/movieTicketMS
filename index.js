const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser');
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const Account = require('./models/account')
const bcrypt = require('bcrypt')

const app = express()

app.use(cookieParser('ptt_nmtt_tnp'));
app.use(session({ cookie: { maxAge: 12000000 } })); //2h
app.use(flash());

// const hashed = bcrypt.hashSync('123456', 5)
// let account = new Account({
//     name: 'admin',
//     email: 'admin@gmail.com',
//     password: hashed,
//     role: 'admin'
// })

// account.save()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/assets'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use('/', require('./routers/Home'))
app.use('/booking',require('./routers/ticket-booking'))


const PORT = process.env.PORT || 3000
const LINK_WEB = process.env.LINK_WEB || 'http://localhost:' + PORT
const {MONGODB_URI, DB_NAME} = process.env


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME
})
.then(() => {
    app.listen(PORT, () => {
        console.log(LINK_WEB)
    })
})
.catch(e => console.log('Can not connect db server: ' + e.message))