const Message = require('../model/message')
exports.Postmsg= async (req,res,next)=>{

    var {msg}= req.body
    try{
        const m = await Message.create({

        chat: msg,
        userId : req.user.id,
        Username : req.user.Username
   })
   res.json({m });
}
catch(err){
    console.log(err)
}
}

exports.GetAllChats = async (req, res, next) => {
    try {
      const messages = await Message.findAll({ attributes: ['chat','Username'] });
      console.log(messages)
      const chatMessages = [];
      for (let i = 0; i < messages.length; i++) {
        chatMessages.push({
          chat: messages[i].chat,
          Username: messages[i].Username,
        });
      }
      console.log(chatMessages)
      res.json({ messages: chatMessages });
    } catch (err) {
      console.log(err);
    }
  };