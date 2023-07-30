const express = require('express')
const route = express.Router()
const Chat = require('../control/chat.js')
const Group = require('../control/newgroup.js')
const auth = require('../middleware/auth.js')

route.post('/chat',auth.authenticate ,Chat.Postmsg)
route.post('/newgroup',auth.authenticate,Group.postNewGroup)
route.get('/newgroup',auth.authenticate,Group.GetNewGroup)
route.get('/chat',auth.authenticate,Chat.GetAllChats)
module.exports= route