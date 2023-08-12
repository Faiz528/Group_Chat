const  Sequelize  = require('sequelize')
const sequelize = require('../util/database')
const Group = sequelize.define('group',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    GroupName:{
         type : Sequelize.STRING,
         allowNull : false,
         unique : true
    
    },
    AdminId:{
        type: Sequelize.INTEGER,
        allowNull : false
    }
})

module.exports = Group