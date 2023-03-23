const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const PublicRoomMessageSchemaModel = connectDB.sequelize.define('publicRoomMessages', {
  message: {
    type: DataTypes.STRING,
    default: ""
  },
//   message_id: {type: DataTypes.STRING},
  sender_id: { type: DataTypes.INTEGER },
  sender_name: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
  imgs: { type: DataTypes.JSON },
  videos: {
      type: DataTypes.JSON
  },
  videosthumb: {
      type: DataTypes.JSON
  },
  room_id: {
    type: DataTypes.STRING
  },
  top: {
    type: DataTypes.BOOLEAN,
    default: false
  },
  top_set_user_id: {
    type: DataTypes.INTEGER,
  },
  top_set_time: {
    type: DataTypes.DATE,
    default: Date.now
  },
  is_announcement: {
    type: DataTypes.BOOLEAN,
    default: false
  },
  is_admin_announcement: {
    type: DataTypes.BOOLEAN,
    default: false
  },
  announcement_email: {
    type: DataTypes.STRING,
    default: null
  },
  createdAt: {
    type: DataTypes.DATE,
    default: Date.now
  },
  receiver_ids: {
    type: DataTypes.JSON,
  },
},
{
    timestamps: false
});

PublicRoomMessageSchemaModel.sync().then(() => {
     console.log('publicRoomMessages table created successfully!');
}).catch((error) => {
     console.error('Unable to create publicRoomMessages table');
});

module.exports = {
  PublicRoomMessageSchemaModel
};
