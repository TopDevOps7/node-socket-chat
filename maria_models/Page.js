const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const PageSchema = connectDB.sequelize.define('Page', {
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  content: DataTypes.STRING
},
{
    timestamps: false
});

PageSchema.sync().then(() => {
     console.log('page table created successfully!');
}).catch((error) => {
     console.error('Unable to create page table');
});

module.exports = {
     PageSchema
 }
 