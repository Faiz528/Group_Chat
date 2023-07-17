const express = require('express')
const route =  express.Router()

const Signup = require('../control/signup.js')

route.post('/signup',Signup.PostUser)

module.exports = route