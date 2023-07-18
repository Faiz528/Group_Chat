const express = require('express')
const app = express();
const Parser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const axios = require('axios')
const User = require('./model/user')



app.use(Parser.json({extended:false}))
app.use(cors())

const Signup = require('./route/signup')
app.use(Signup)

const Login = require('./route/login')
app.use(Login)


sequelize.
sync().then(result=>{
  app.listen(3000)
}).catch(err=>{
    console.log(err)
})
