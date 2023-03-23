const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const messageSchemaModel = connectDB.sequelize.define("messages", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
   },
    message: {
        type: DataTypes.STRING,
        default: '',
    },
    message_type: {
        type: DataTypes.INTEGER,
        default: 0
    },
    img: {
        type: DataTypes.STRING,
        default: ''
    },
    imgs: {
        type: DataTypes.JSON
    },
    videos: {
        type: DataTypes.JSON
    },
    videosthumb: {
        type: DataTypes.JSON
    },
    isDeleted: {
        type: DataTypes.INTEGER,
        default: 0
    },
    sender_id: {
        type: DataTypes.INTEGER
    },
    receiver_id: {
        type: DataTypes.INTEGER
    },
    chat_id: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE,
        default: Date.now()
    }
},
{
    timestamps: false
});

messageSchemaModel.sync().then(() => {
     console.log('messages table created successfully!');
}).catch((error) => {
     console.error('Unable to create messages table');
});

module.exports = {
    messageSchemaModel,
}
