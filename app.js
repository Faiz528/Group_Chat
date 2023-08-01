const express = require('express')
const app = express();
const Parser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const axios = require('axios')
const User = require('./model/user')
const Message = require('./model/message')
const Group = require('./model/group')
const forgotPassword = require('./model/forgotpassword')
app.use(cors())

User.hasMany(Message)
Message.belongsTo(User)

Group.hasMany(Message)
Message.belongsTo(Group)

User.hasMany(forgotPassword)
forgotPassword.belongsTo(User)

const UserGroup = sequelize.define('UserGroup', {});
User.belongsToMany(Group,{through:UserGroup})
Group.belongsToMany(User,{through:UserGroup})


app.use(Parser.json({extended:false}))

const Password = require('./route/forgot')
app.use(Password)

const Signup = require('./route/signup')
app.use(Signup)

const Login = require('./route/login')
app.use(Login)

const Chat = require("./route/chat")
app.use(Chat)

const GroupChat = require("./route/groupchat")
app.use(GroupChat)


sequelize.
sync().then(result=>{
  app.listen(3000)
}).catch(err=>{
    console.log(err)
})
