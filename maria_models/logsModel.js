const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const logsSchemaModel = connectDB.sequelize.define('logs', {
     date: {
          type: DataTypes.DATE,
          defaultValue: new Date()
      },
      log_time: {
          type: DataTypes.INTEGER,
          defaultValue: Date.now
      },
      online_user_num: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      },
      register_user_num: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      },
      app_install_num: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      },
      app_download_num: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      },
      year: {
          type: DataTypes.INTEGER,
          defaultValue: 1990
      },
      month: {
          type: DataTypes.INTEGER,
          defaultValue: 1
      },
      day: {
          type: DataTypes.INTEGER,
          defaultValue: 1
      },
},
{
    timestamps: false
});

logsSchemaModel.sync().then(() => {
     console.log('logs table created successfully!');
}).catch((error) => {
     console.error('Unable to create logs table');
});

module.exports = {
    logsSchemaModel,
}
