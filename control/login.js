const User = require('../model/user')
const bcrypt = require('bcrypt')


exports.GetUser= async(req,res,next)=>{
   const  {email,password}= req.body
}