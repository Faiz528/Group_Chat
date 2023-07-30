
const Group = require('../model/group')
const User = require('../model/user')
const Message = require('../model/message')


exports.postNewGroup= async(req,res,next)=>{
    var{name}=req.body
    try{
    const group = await Group.create({
        GroupName:name
    })
     //const user = await User.findByPk(req.user.id)
    const add =await group.addUser(req.user)
    res.json(group)
}
catch(err){
    console.log(err)
}
}

exports.GetNewGroup= async(req,res,next)=>{
    var{name}=req.body
    try{
    
     //const user = await User.findByPk(req.user.id)
    const groupname =await req.user.getGroups()
    res.json(groupname)
}
catch(err){
    console.log(err)
}
}
exports.AddUser= async(req,res,next)=>{
    try {
      const {member,groupname} = req.body; 
      console.log(req.body);
  
      const user = await User.findOne({ where: {Username : member } });
      const group = await Group.findOne({
        GroupName:groupname
    })
    console.log(group.GroupName)
     // const id = user.id
      //console.log(id)
      //console.log(user);
       
      if (!user) {
        console.log("Not found")
        return res.status(404).json({error:"User not found"}); // User not found, return null
      } else {
       
       const isUserAdded = await group.hasUser(user);
      
      if (isUserAdded) {
        return res.status(400).json({ error: "User is already added to the group" });
      }
       //const user = await User.findByPk(req.user.id)
      const add =await group.addUser(user)
      
          return res.status(200).json({message :member+"added" ,  name:user.Username})
        } 
    }
    catch(err){
      console.log(err)
    }
  } 

  exports.getMember = async(req,res,next)=>{
    try{
      const {groupname} = req.query
      console.log(groupname)
      const group = await Group.findOne({where:{GroupName:groupname}})
      const member= await group.getUsers()
      res.json(member)
    }
    catch(err){
      console.log(err)
    }
  }
  exports.Postmsg= async (req, res,next) => {
    try {
      const { msg, groupname } = req.body;
      const group = await Group.findOne({ where: { GroupName: groupname } });
      
    
  
      const newMessage = await Message.create({
        chat: msg,
        groupId: group.id, // Assuming you have a "GroupId" foreign key in the Message model to link it to the corresponding group
        Username: req.user.Username,
        userId:req.user.id,
        // Assuming you have the username of the sender in req.user.Username (you need to handle user authentication to access this information)
      });
  
      return res.status(201).json({ message: 'Message sent successfully', m: newMessage });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } ;

  exports.Getmsg=async (req, res) => {
    try {
      const {groupname} = req.query;
      const group = await Group.findOne({ where: { GroupName: groupname } });

      const messages = await Message.findAll({
        where: { GroupId: group.id },
        attributes: ['chat', 'Username'] // Only select the 'chat' and 'Username' columns
      });
  
      return res.status(200).json(messages);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  


   