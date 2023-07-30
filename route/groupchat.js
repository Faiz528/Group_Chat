const express = require('express')
const route = express.Router()
const Chat = require('../control/chat.js')
const Group = require('../control/newgroup.js')
const auth = require('../middleware/auth.js')

route.post('/chats',auth.authenticate,Group.Postmsg)
route.get('/chats',Group.Getmsg)
route.post('/addmember',Group.AddUser)
route.get('/getparticipants',auth.authenticate,Group.getMember)

route.post('/deleteParticipant',auth.authenticate,Group.DeleteUser)
module.exports= route