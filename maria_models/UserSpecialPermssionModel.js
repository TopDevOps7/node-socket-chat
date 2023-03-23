const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')
const jwt = require('jsonwebtoken');

const UserSpecialPermssionSchemaModel = connectDB.sequelize.define("userSpecialPermssion", {
  userId: {
    type: DataTypes.STRING,
  },
  user_email: {
    type: DataTypes.STRING,
    default: null
  },
  max_coverage: {
    type: DataTypes.INTEGER,
    default: null
  },
  top_message_max_num: {
    type: DataTypes.INTEGER,
    default: null
  },
  effect_year: {
    type: DataTypes.INTEGER,
    default: null
  },
  effect_month: {
    type: DataTypes.INTEGER,
    default: null
  },
  effect_day: {
    type: DataTypes.INTEGER,
    default: null
  },
  valid_period: {
    type: DataTypes.INTEGER,
    default: null
  },
  effect_time: {
    type: DataTypes.BIGINT,
    default: 0
  },
  expire_time: {
    type: DataTypes.BIGINT,
    default: 0
  }
},
{
    timestamps: false
});

UserSpecialPermssionSchemaModel.sync().then(() => {
     console.log('UserSpecialPermssion table created successfully!');
}).catch((error) => {
     console.error('Unable to create UserSpecialPermssion table');
});

module.exports = {
  UserSpecialPermssionSchemaModel,
}
