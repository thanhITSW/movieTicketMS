const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser');
const flash = require('express-flash')
const cookieParser = require('cookie-parser')

const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const file  = fs.readFileSync('./api-docs.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
const app = express()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cookieParser('ptt_nmtt_tnp'));
app.use(session({ cookie: { maxAge: 12000000 } })); //2h
app.use(flash());


app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/assets'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use('/', require('./routers/Home'))
app.use('/booking',require('./routers/ticket-booking'))
app.use('/movie-manage',require('./routers/movie-manage'))


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