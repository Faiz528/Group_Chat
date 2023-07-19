const express = require('express')
const app = express();
const Parser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const axios = require('axios')
const User = require('./model/user')
const Message = require('./model/message')
app.use(cors())

User.hasMany(Message)
Message.belongsTo(User)


app.use(Parser.json({extended:false}))
app.use(cors())

const Signup = require('./route/signup')
app.use(Signup)

const Login = require('./route/login')
app.use(Login)

const Chat = require("./route/chat")
app.use(Chat)


sequelize.
sync().then(result=>{
  app.listen(3000)
}).catch(err=>{
    console.log(err)
})
