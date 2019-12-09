const express          = require('express')
const server           = express()
const PORT             = process.env.PORT || 3001
const mongoose         = require('mongoose')
const cors             = require('cors')
const url              = 'mongodb://localhost:27017/findlove'
const { REGISTRATION } = require('./router/Registration')
const { LOGIN }        = require('./router/Login')
const { POST }         = require('./router/Post')
const { HOME }         = require('./router/Home')
const { SEARCH }       = require('./router/Search')
const { UPDATEMOREINFO } = require('./router/updateMoreInfo')
const { LOGINTESTADDFRIEND } = require('./router/loginTestAddFriend')
const { TESTADDFRIEND } = require('./router/addFriendTest')
const bodyParser       = require('body-parser')
const session          = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge:60*60*60*24}
  });
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(cors())
server.use(express.static("storeImg"));
server.set('view engine','ejs');
server.set('views','./views');
server.use('/findlove',REGISTRATION)
server.use('/findlove',LOGIN)
server.use('/findlove',POST)
server.use('/findlove',HOME)
server.use('/findlove',SEARCH)
server.use('/findlove',UPDATEMOREINFO)
server.use('/findlove',LOGINTESTADDFRIEND)
server.use('/findlove',TESTADDFRIEND)
mongoose.connect(url);
mongoose.connection.once('open', () => {
    server.listen(PORT, () => console.log(`server started at port ${PORT}`))
})