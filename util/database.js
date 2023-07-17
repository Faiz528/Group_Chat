const Sequelize = require('sequelize')
const sequelize = new Sequelize('group_chat' ,'root',  'Gate@2022',{
    dialect : 'mysql',
    host :'localhost'
})

module.exports = sequelize