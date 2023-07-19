const express = require('express')
const route = express.Router()
const Chat = require('../control/chat.js')
const auth = require('../middleware/auth.js')

route.post('/chat',auth.authenticate ,Chat.Postmsg)
module.exports= route