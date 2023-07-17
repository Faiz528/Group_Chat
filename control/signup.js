const User = require('../model/user')
const bcrypt = require('bcrypt')
exports.PostUser=async(req,res,next)=>{
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const result =await User.create({
      Username: name,
      Email: email,
      Password: hashedPassword,
    });
  
    // User creation successful
    res.status(200).json(result);
  } catch (err) {
    // Check if it's a unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
      // Handle duplicate email error
      res.status(409).json({ error: 'Email already exists' });
    } else {
      // Handle other errors
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}