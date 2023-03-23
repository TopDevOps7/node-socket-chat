const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const roomsSchemaModel = connectDB.sequelize.define("chatsRooms", {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
     },
     users: {
          type: DataTypes.JSON
     },
     lastMessage: {
          type: DataTypes.JSON
     },
    created: {
        type: DataTypes.DATE,
        default: Date.now()
    }
},
{
    timestamps: true
});

roomsSchemaModel.sync().then(() => {
     console.log('chatsRooms table created successfully!');
}).catch((error) => {
     console.error('Unable to create chatsRooms table');
});

module.exports = {
    roomsSchemaModel,
}