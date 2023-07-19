const Message = require('../model/message')
exports.Postmsg= async (req,res,next)=>{

    var {msg}= req.body
    try{
        const m = await Message.create({

        chat: msg,
        userId : req.user.id
   })
   res.json(m)
}
catch(err){
    console.log(err)
}
}