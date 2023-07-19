const express = require('express')
const route = express.Router()
const Login = require('../control/login.js')

route.post('/login',Login.VerifyUser)
module.exports= route