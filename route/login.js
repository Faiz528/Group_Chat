const express = require('express')
const route = express.Router()
const Login = require('../control/login.js')

route.get('/login',Login.GetUser)
module.exports= route