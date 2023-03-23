const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const settingsSchemaModel = connectDB.sequelize.define('settings', {
    type: {
        type: DataTypes.STRING,
        max: 30,
        min: 5
    },
    settings: {
        type: DataTypes.JSON
    }
},
{
    timestamps: false
});

settingsSchemaModel.sync().then(() => {
     console.log('settings table created successfully!');
}).catch((error) => {
     console.error('Unable to create settings table');
});

module.exports = {
    settingsSchemaModel
}
