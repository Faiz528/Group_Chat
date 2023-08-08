const Group = require('../model/group');
const User = require('../model/user');
const Message = require('../model/message');
const AWS = require('aws-sdk')
const multer = require('multer')
//const upload = multer({dest:"uploads/"})

//const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

exports.Uploads = (req, res) => {
  upload.single('fileInput')(req, res, function (err) {
    if (err) {
      // Handle multer error, if any
      return res.status(400).json({ error: err.message }); 
    }
    
    console.log(req.file); // Uploaded file details
    console.log(req.body); // Other form fields

    // Send a response indicating success
    res.status(200).json({ message: 'File uploaded successfully.' ,url:req.file.path});
  });
};


exports.postNewGroup = async (req, res, next) => {
  const { name } = req.body;
  try {
    const group = await Group.create({
      GroupName: name,
      AdminId: req.user.id
    });
    await group.addUser(req.user);
    res.json(group);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.GetNewGroup = async (req, res, next) => {
  try {
    const groupname = await req.user.getGroups();
    res.json(groupname);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.AddUser = async (req, res, next) => {
  try {
    const { member, groupname } = req.body;
    const user = await User.findOne({ where: { Username: member } });
    const group = await Group.findOne({ where: { GroupName: groupname } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isUserAdded = await group.hasUser(user);

    if (isUserAdded) {
      return res.status(400).json({ error: 'User is already added to the group' });
    }

    const add = await group.addUser(user);

    return res.status(200).json({ message: `${member} added`, name: user.Username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMember = async (req, res, next) => {
  try {
    const { groupname } = req.query;
    const group = await Group.findOne({ where: { GroupName: groupname } });
    const members = await group.getUsers();

    const loggedInUserId = req.user.id;
    const filteredMembers = members.filter((member) => member.id !== loggedInUserId);

    res.json(filteredMembers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.Postmsg = async (req, res, next) => {
  try {
    const { msg, groupname } = req.body;
    const group = await Group.findOne({ where: { GroupName: groupname } });
    var sms=""
    // Check if the message is a file name or a regular chat message
    if (msg && msg.startsWith('http://localhost:3000/upload/')) {
      // This is a file message, save it as a message with file URL in the database
      const newMessage = await Message.create({
        chat: 'File'+ msg, // Store the file name as a part of the chat message
        groupId: group.id,
        Username: req.user.Username,
        userId: req.user.id,
      });
      sms = newMessage
    } else {
      // This is a regular chat message, save it without any modifications
      const newMessage = await Message.create({
        chat: msg,
        groupId: group.id,
        Username: req.user.Username,
        userId: req.user.id,
      });
      sms= newMessage
    }
  
     console.log(sms)
    return res.status(201).json({ message: 'Message sent successfully', m: sms});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.Getmsg = async (req, res) => {
  try {
    const { groupname } = req.query;
    const group = await Group.findOne({ where: { GroupName: groupname } });

    const messages = await Message.findAll({
      where: { GroupId: group.id },
      attributes: ['chat', 'Username']
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.DeleteUser = async (req, res, next) => {
  try {
    const { member, groupname } = req.body;
    const user = req.user;

    const group = await Group.findOne({ where: { GroupName: groupname } });

    const isUserCreator = group.AdminId === user.id;
    if (!isUserCreator) {
      return res.status(403).json({ error: 'You are not authorized to delete participants from this group' });
    }

    const userToDelete = await User.findOne({ where: { Username: member } });
    const isUserAdded = await group.hasUser(userToDelete);
    if (!isUserAdded) {
      return res.status(400).json({ error: 'User is not a participant of this group' });
    }

    await group.removeUser(userToDelete);

    return res.status(200).json({ message: `${member} removed from the group` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.Upload = async (req, res, next) => {
  try {
    const {fileName,fileType} = req.body
  const Stringify = JSON.stringify(fileName)
  const fileNames =`${fileName}`
  const fileUrl = await uploadToS3(Stringify,fileNames)
  console.log(fileUrl)

    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: '', success: false, err: err });
  }
};

function uploadToS3(data,filename)
{
  const BUCKET_NAME='expensestracker1'
  const IAM_USER_KEY = process.env.IAM_USER_KEYS
  const IAM_USER_SECRET= process.env.IAM_USER_SECRETS

  let s3bucket = new AWS.S3({
    accessKeyId : IAM_USER_KEY,
    secretAccessKey : IAM_USER_SECRET,
    
  })
  
    var params ={
      Bucket : BUCKET_NAME,
      Key: filename,
      Body:data,
      ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{

      s3bucket.upload(params,(err,s3response)=> {
        if(err)
        console.log(err)
        else{
        console.log('success',s3response)
        resolve(s3response.Location)
        }
      })

    })
   
}
