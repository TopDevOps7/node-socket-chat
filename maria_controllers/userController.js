"use strict";
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const passwordHash = require("password-hash");
const jwt = require('jsonwebtoken');
const Sentry = require("@sentry/node");
const {Op} = require('sequelize');

const { userSchemaModel } = require('../maria_models/userModel');
const { settingsSchemaModel } = require('../maria_models/settingsModel');
const { UserSpecialPermssionSchemaModel } = require('../maria_models/UserSpecialPermssionModel');
module.exports = {
    saveUserSepcialPermission: async function (req, res) {
        const { user_email, max_coverage, top_message_max_num, effect_year, effect_month, effect_day, valid_period } = req.body;
        const effectDate = new Date(`${effect_year}-${effect_month}-${effect_day} 00:01:00`);
        const expireDate = new Date(effectDate.getTime() + valid_period * 86400000);
        let userPermissions = {
            user_email,
            max_coverage,
            top_message_max_num,
            effect_year,
            effect_month,
            effect_day,
            valid_period,
            effect_time: effectDate.getTime(),
            expire_time: expireDate.getTime()
        }
        const perm = await UserSpecialPermssionSchemaModel.findOne({ where : { userId: req.params.userId }});
        if (perm)
            await UserSpecialPermssionSchemaModel.update(userPermissions, { where : { userId: req.params.userId }});
        else
        {
            userPermissions.userId = req.params.userId;
            await UserSpecialPermssionSchemaModel.create(userPermissions).catch((error) => {
                console.error('UserSpecialPermssionSchemaModel failed : ', error);
           });
        }

        res.json({
            success: true,
            message: 'Saved Successfully !'
        });
    },
    getSpecialPermissions: async (req, res) => {
        const userSpecialPermissions = await UserSpecialPermssionSchemaModel.findAll();
        if (!userSpecialPermissions) {
            res.status(401).json({ error: true, data: "no user special permssions found !" });
        } else {
            res.status(200).json({ error: false, data: userSpecialPermissions });
        }
    },
    clearSpecialPermission: async (req, res) => {
        const userId = req.params.userId;
        await UserSpecialPermssionSchemaModel.destroy({ where : { userId: userId }
        }).then(result => {
            res.send({ error: false, data: "Clear Successfully" });
        }).catch(err => {
            res.status(400).send({ error: true, data: 'err' + err });
        })
    },
    getUsers: async (req, res) => {
        const users = await userSchemaModel.findAll({
            where : {
                token: 0
            },
            order : [
                ['role', 'ASC'],
                ['created', 'DESC'],
            ]
        });
        let result = users.map((value, index) => {
            let user = value.toJSON();
            return user;
        });
        if (!result) {
            res.status(401).json({ error: true, data: "getUsers no user found !" });
        } else {
            res.status(200).json({ error: false, data: result });
        }
    },
    createUser: async (req, res) => {
        const { error } = createUserValidation(req.body);
        if (!error || 1) {
            const { email, name, password, gender, role,} = req.body;
            const hashedPassword = await passwordHash.generate(password);

            const user = await userSchemaModel.findOne({where : { email }});
            console.log('createUser : ', user);
            if (user) {
                return res.status(401).json({
                    success: false,
                    message: "The email already exists. Please choose another."
                });
            }

            await userSchemaModel.create({
                name: name,
                email: email,
                gender: gender,
                password: hashedPassword,
                originPassword: password,
                role: role,
                created: new Date(),
           }).then(result => {
                const accessToken = jwt.sign({ result }, 'secret');
                res.json({
                     success: true,
                     message: 'register successfully',
                     accessToken: accessToken,
                     user: result
                });
           }).catch((err) => {
                res.status(401).json({
                    success: false,
                    message: err.message
                });
           });
        } else {
            let detail = error.details[0].message;
            res.status(400).send({ error: true, data: detail });
        }
    },
    updateUser: async (req, res) => {
        const { name, email, password, gender, role, phoneNumber, address, status, avatarUrl, deviceToken } = req.body;
        const params = {
            name: name,
            email: email,
            gender: gender,
            role: role,
            phoneNumber: phoneNumber,
            address: address,
            status: status,
            avatarUrl: avatarUrl,
            deviceToken: deviceToken
        };
        if (password && password.trim() != "") {
            const hashedPassword = await passwordHash.generate(password.trim());
            params.password = hashedPassword;
            params.originPassword = password.trim();
        }
        if (avatarUrl) {
            params.avatarUrl = avatarUrl.path;
        }
        await userSchemaModel.update(params, {where : {id : req.params.userId}
        }).then(result => {
            res.send({ error: false, data: result });
        }).catch(err => {
            res.status(400).send({ error: true, data: 'err' + err });
        });
    },
    deleteUser: async (req, res) => {
        await userSchemaModel.destroy({where: { id :req.params.userId}
        }).then(deletedRecord => {
            res.send({ error: false });
        }).catch(err => {
            res.status(400).send({ error: true, data: 'err' + err });
        })
    },
    addUserImg: async (req, res) => {
        let user_id = req.params.userId;
        let name = req.file.filename;
        // console.log(user_id, name);
        let bio = req.body.bio;
        if (bio) {
            await userSchemaModel.update({ avatarUrl: name, img: name, bio: bio }, {where : {id : user_id}
            }).then(result => {
                res.send({ error: false, data: name });
            }).catch(err => {
                res.status(400).send({ error: true, data: 'err' + err });
            });
        } else {
            await userSchemaModel.update({ avatarUrl: name, img: name }, {where : {id : user_id}
            }).then(result => {
                res.send({ error: false, data: name });
            }).catch(err => {
                res.status(400).send({ error: true, data: 'err' + err });
            });
        }
    },
    getUserImg: async (req, res) => {
        let userId = req.params.userId;
        try {
            const user = await userSchemaModel.findById(userId);
            let file = user.avatarUrl;
            let fileLocation = '';
            if (file) {
                fileLocation = path.resolve(__dirname, '../uploads/users_profile_img', file);
            }
            let fileExist = fs.existsSync(fileLocation)
            if (!fileExist) {
                fileLocation = path.resolve(__dirname, '../uploads/users_profile_img/default-user-profile-image.png');
            }
            res.sendFile(`${fileLocation}`);
        } catch (err) {
            return res.status(500).json({ error: true, data: "getUserImg no user found !" });
        }
    },
    getImgSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/users_profile_img', req.params.imageName);
        let fileExist = fs.existsSync(fileLocation)
        if (!fileExist) {
            fileLocation = path.resolve(__dirname, '../uploads/users_profile_img/default-user-profile-image.png');
        }
        res.sendFile(`${fileLocation}`);
    },
    updatePassword: asyncHandler(async (req, res) => {
        const { error } = updatePasswordValidation(req.body)
        if (!error) {
            let user_id = req.params.userId;
            let old_password = req.body.old_password;
            let new_password = req.body.new_password;
            try {
                const user = await userSchemaModel.findOne({where : {id : user_id}});

                const isPasswordMatch = await passwordHash.verify(
                    old_password,
                    user.password
                );
                if (!isPasswordMatch) {
                    res.status(401).json({ error: true, data: "password not match !" });
                } else {
                    const hashedPassword = await passwordHash.generate(new_password);
                    await userSchemaModel.update({ password: hashedPassword, originPassword: new_password }, {where : {id : user_id}
                    }).then(result => {
                        res.send({ error: false, data: 'done' });
                    }).catch(err => {
                        res.status(400).send({ error: true, data: 'err' + err });
                    });
                }
            } catch (err) {
                res.status(500).json({ error: true, data: "updatePassword no user found !" });
            }
        } else {
            let detail = error.details[0].message;
            res.status(400).send({ error: true, data: detail });
        }
    }),
    updateAndAddDeviceToken: async function (req, res) {
        if (req.body.id && req.body.deviceToken) {
            await userSchemaModel.update({deviceToken: req.body.deviceToken}, {where : { id : req.body.id}});
            res.json({
                error: false,
                data: 'done'
            });
        } else {
            res.status(400).json({
                error: true,
                data: ' user id is required! or deviceToken '
            });
        }
    },
    getUser: async (req, res) => {
        const userId = req.params.userId;
        try {
            const user = await userSchemaModel.findOne({ where : {id : userId}});
            const parameterSettings = await settingsSchemaModel.findOne({where : { type: "parameter" }});
            const chatAdminEmail = parameterSettings.settings.online_chat_admin_email;
            let chatAdminId = null;
            let isExistAdmin = false;
            if (chatAdminEmail) {
                const adminUser = await userSchemaModel.findOne({where : { role: "admin", email: chatAdminEmail }});
                if (adminUser) {
                    chatAdminId = adminUser.id;
                    isExistAdmin = true;
                }
            }
            res.status(200).json({ error: false, data: { ...user.dataValues, ...{chatAdminId, isExistAdmin} } });
        }  catch (e) {
            Sentry.captureException(e);
            res.status(500).json({ error: true, data: "getUser no user found !" });
        }
    },
    setUserName: async (req, res) => {
        const user_id = req.params.userId;
        const {
            nickname
        } = req.body;
        try {
            await userSchemaModel.update({ name: nickname }, { where : {id : user_id}}).then(result => {
                res.json({ error: false, data: "Saved Successfully" });
            }).catch(err => {
                res.status(400).send({ error: true, data: 'err' + err });
            });
        } catch (err) {
            res.status(500).json({ error: true, data: "setUserName no user found !" });
        }
    },
    getLocalUsers: async (req, res) => {
        const userId = req.params.userId;
        try {
            const userList = await userSchemaModel.findAll({
                where : {[Op.not]:[{id:userId}]},
                attributes: {
                    exclude: ['token', 'originPassword', 'password']
                },
                order : [
                    ['created', 'DESC']
                ]
            });
            res.status(200).json({ error: false, data: userList });
        } catch (err) {
            res.status(400).send({ error: true, data: err.message });
        }
    },
};

function createUserValidation(user) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
    });
    return Joi.validate(user, schema);
}

function updatePasswordValidation(user) {
    const schema = Joi.object().keys({
        // user_id: Joi.string().required(),
        old_password: Joi.string().min(1).max(30).required(),
        new_password: Joi.string().min(1).max(30).required(),
    });
    return Joi.validate(user, schema);
}
