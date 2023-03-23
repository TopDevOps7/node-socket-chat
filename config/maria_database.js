const Sequelize = require('sequelize')
const DBname = 'talking'
const DBuser = 'root'
const DBpassword = 'root'

const asyncHandler = require('express-async-handler');

const sequelize = new Sequelize(DBname, DBuser, DBpassword, {
     host: 'localhost',
     dialect: 'mariadb',
     operatorsAliases: false,
     dialectOptions: {
       supportBigNumbers: true,
       bigNumberStrings: true
     },
   
     pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
     }
   });

const connectDB = asyncHandler(async () => {
     sequelize.authenticate().then(() => {
          console.log('MariaDB Connection has been established successfully.');
     }).catch((error) => {
          console.error('Unable to connect to the database');
     });
});

connectDB.sequelize = sequelize;
module.exports = connectDB;