const Group = require('../model/group');
const User = require('../model/user');
const Message = require('../model/message');

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

    const newMessage = await Message.create({
      chat: msg,
      groupId: group.id,
      Username: req.user.Username,
      userId: req.user.id,
    });

    return res.status(201).json({ message: 'Message sent successfully', m: newMessage });
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
