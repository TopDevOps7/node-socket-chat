const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const notificationsSchemaModel = connectDB.sequelize.define("notifications", {
    name: {
        type: DataTypes.STRING,
        required: true,
    },
    title: {
        type: DataTypes.STRING,
        required: true,
    },
    userImg: {
        type: DataTypes.STRING,
        required: true,
    },
    postId: {
        type: DataTypes.STRING,
        required: true,
    },
    notif_to_user: {
        type: DataTypes.STRING,
        required: true,
    },
    my_id: {
        type: DataTypes.STRING,
        required: true,
    },
    created: {
        type: DataTypes.DATE,
        default: Date.now
    },

}, {
    timestamps: true
});

notificationsSchemaModel.sync().then(() => {
    console.log('notifications table created successfully!');
}).catch((error) => {
    console.error('Unable to create notifications table');
});

module.exports = {
    notificationsSchemaModel,
}
