const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const passwordHash = require("password-hash");
const { userSchemaModel } = require('../maria_models/userModel');

exports.myAccount = asyncHandler(async (req, res, next) => {
     const user = await userSchemaModel.findOne({ where : {id : req.user.id} });
          res.json({
          success: true,
          user
     });
});
   
exports.register = asyncHandler(async (req, res, next) => {
     const { name, email, password, gender, role, phoneNumber, address, status, deviceToken } = req.body;
     const hashedPassword = await passwordHash.generate(password);

     userSchemaModel.findOne({
          where: { email }
     }).then(result => {
          let user = result
          if (user) {
            return res.status(401).json({
              success: false,
              message: "The email already registered. Please choose another."
            });
          }
          userSchemaModel.findOne({
               where : {name}
          }).then(result => {
               if (result)
               {
                    return res.status(401).json({
                         success: false,
                         message: "The username already registered. Please choose another."
                    });
               }
               userSchemaModel.create({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    originPassword: password,
                    gender: gender,
                    role: role,
                    phoneNumber: phoneNumber,
                    address: address,
                    status: status,
                    created: new Date(),
                    deviceToken: deviceToken
               }).then(result => {
                    const accessToken = jwt.sign({ result }, 'secret');
                    res.json({
                         success: true,
                         message: 'register successfully',
                         accessToken: accessToken,
                         user: result
                    });
               }).catch((error) => {
                    console.error('register failed to create a new record : ', error);
                    res.status(401).json({
                         success: false,
                         message: error
                    });
               });
          })
     }).catch((error) => {
          console.error('register failed to retrieve data : ', error);
     })
});

exports.adminlogin = asyncHandler(async (req, res, next) => {
     const email = req.body.email;
     const password = req.body.password;
     const user = await userSchemaModel.findOne({ where : { email, role: 'admin' }});

     if (!user) return res.json({ success: false, message: 'There is no user corresponding to the email address.' }).status(400);
   
     const isPasswordMatch = await passwordHash.verify(
       password,
       user.password
     );
   
     if (!isPasswordMatch) {
       return res.json({ success: false, message: 'Wrong password' }).status(400);
     }
   
     let accessToken = null;
     try {
       if (user.token) {
         const decoded = jwt.verify(user.token, 'secret');
         if (decoded && decoded.user._id == user._id) {
           accessToken = user.token;
         }
       }
     } catch (err) {
   
     }
     if (!accessToken)
       accessToken = jwt.sign({ user }, 'secret', { expiresIn: '365d' });

     await userSchemaModel.update({ online: true, token: accessToken }, { where: { email }});
   
     res.json({
       success: true,
       message: 'login successfully',
       accessToken,
       user
     });
});

exports.logout = asyncHandler(async (req, res, next) => {
     const email = req.user.email;
     await userSchemaModel.update({ online: false, token: '' }, { where : { email }});
   
     res.json({
       success: true,
       message: 'logout successfully'
     });
});

exports.loginV2 = asyncHandler(async (req, res, next) => {
     const name = req.body.name;
     const password = req.body.password;

     const user = await userSchemaModel.findOne({ where : { name }});

     if (!user) return res.json({ success: false, message: 'The user does not exist.' }).status(400);

     const isPasswordMatch = await passwordHash.verify(
          password,
          user.password
     );

     if (!isPasswordMatch) {
          return res.json({
          success: false,
          message: 'Incorrect password.'
          }).status(400);
     }

     let accessToken = null;
     if (user.token) {
          const decoded = jwt.verify(user.token, 'secret');
          if (decoded && decoded.user.id == user.id) {
               accessToken = user.token;
          }
     }
     if (!accessToken)
          accessToken = jwt.sign({ user }, 'secret', { expiresIn: '365d' });

     await userSchemaModel.update({ online: true, token: accessToken }, {where : { name }});

     res.json({
          success: true,
          message: 'login successfully',
          accessToken,
          user
     });
});
   