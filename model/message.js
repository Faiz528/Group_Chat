const  Sequelize  = require('sequelize')
const sequelize = require('../util/database')
const Message = sequelize.define('message',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    chat:{
         type : Sequelize.STRING,
         allowNull : false,
    
    },
    Username:{
    type : Sequelize.STRING,
    allowNull : false,

},
})
module.exports=Message