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
const route = express.Router()
const multer = require('multer')
//const upload = multer({dest:"uploads/"})
app.use(cors())
app.use(express.urlencoded({extended:false}))

const storage = multer.diskStorage({
  destination : function(req,file,cb){
    return cb(null,"./uploads")
  },
  filename: function (req,file,cb){
    return cb(null,`${file.originalname}`)
  }
})
const upload = multer({storage})
route.post("/upload",upload.single("fileInput"),(req,res)=>{

})
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
