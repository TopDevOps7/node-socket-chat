"use strict";
//created by Hatem Ragap

const path = require('path');
const fs = require('fs');
const { QueryTypes } = require('sequelize');
const connectDB = require('../config/maria_database.js');
const {PublicRoomMessageSchemaModel} = require("../maria_models/PublicRoomsMessagesModel");
// const {publicChatRoomModel} = require("../maria_models/publicChatRoomModel");
const {userSchemaModel} = require('../maria_models/userModel');
const { settingsSchemaModel } = require('../maria_models/settingsModel');
const compress_images = require('compress-images');

module.exports = {
    //limit of messages is 100
    fetchAll: async (req, res, next) => {
        let results = {};
        let userId = req.body.user_id;
        if (!userId) {
            userId = req.user.id;
        }
        const page = parseInt(req.body.page);
        const limit = 100;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {
            const messages = await connectDB.sequelize.query(
                "SELECT publicroommessages.id as id,message,publicroommessages.img,imgs,videos,videosthumb,sender_id,sender_name,users.name as user_name,email,gender,online,avatarUrl,top,top_set_user_id,top_set_time,is_announcement,is_admin_announcement,createdAt,room_id FROM publicroommessages JOIN users ON publicroommessages.sender_id = users.id WHERE room_id = $room_id AND is_announcement = true AND top = false ORDER BY createdAt DESC  LIMIT $startIndex, $limit;",
                {
                    bind: { room_id: req.body.room_id, startIndex : startIndex, limit : limit },
                    type: QueryTypes.SELECT
                }
            );
            console.log('PublicRoomsMessageController messages:', messages);
            const resultMessages = messages.map((value, index) => {
                const timeDif = Date.now() - value.createdAt;
                const secsDif = Math.floor(timeDif / 1000);
                const minsDif = Math.floor(timeDif / 60000);
                const hoursDif = Math.floor(timeDif / 3600000);
                const daysDif = Math.floor(timeDif / 86400000);
                let timeDifStr,timeUnit;
                if (secsDif < 60) {
                    timeDifStr = `${secsDif}`;
                    timeUnit = ` sec${secsDif > 1 ? 's' : ''}`;
                } else if (minsDif < 60) {
                    timeDifStr = `${minsDif}`;
                    timeUnit = ` min${minsDif > 1 ? 's' : ''}`;
                } else if (hoursDif < 24) {
                    timeDifStr = `${hoursDif}`;
                    timeUnit = ` hour${hoursDif > 1 ? 's' : ''}`;
                } else {
                    timeDifStr = `${daysDif}`;
                    timeUnit = ` day${daysDif > 1 ? 's' : ''}`;
                }
                return {
                    id: value.id,
                    message: value.message,
                    img: value.img,
                    imgs: value.imgs,
                    videos: value.videos,
                    videosthumb: value.videosthumb,
                    imgPath: "roomMessages/img-src/",
                    sender_id: value.sender_id,
                    sender_name: value.sender_name,
                    nickname: value.user_name,
                    email: value.email,
                    gender: value.gender,
                    online: value.online,
                    avatarUrl: value.avatarUrl,
                    timeDiff: timeDifStr,
                    timeUnit : timeUnit,
                    top: value.top,
                    top_set_user_id: value.top_set_user_id,
                    top_set_time: value.top_set_time,
                    is_announcement: value.is_announcement,
                    is_admin_announcement: value.is_admin_announcement,
                    createdAt: value.createdAt,
                    room_id: value.room_id
                }
            });

            let totalCommentCount = await PublicRoomMessageSchemaModel.count({where : {
                room_id: req.body.room_id, is_announcement: true
            }});
            results.totalCount = totalCommentCount;

            if (endIndex < totalCommentCount) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }
            results.error = false;
            results.data = resultMessages;
            res.send(results);
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
        }
    },
    //fetch Top messages
    fetchTop: async (req, res, next) => {
        const userId = req.params.userId;
        let results = {};

        try {
            const user = await userSchemaModel.findOne({where : {id : userId}});            
            const messages = await connectDB.sequelize.query(
                "SELECT publicroommessages.id as id,message,publicroommessages.img,imgs,sender_id,sender_name,users.name as user_name,email,gender,online,avatarUrl,top,top_set_user_id,top_set_time,is_announcement,is_admin_announcement,createdAt,room_id FROM publicroommessages JOIN users ON publicroommessages.sender_id = users.id WHERE room_id = $room_id AND is_announcement = true AND top = true ORDER BY createdAt DESC;",
                {
                    bind: { room_id: req.body.room_id },
                    type: QueryTypes.SELECT
                }
            );
            let resultMessages = messages.map((value, index) => {
                const timeDif = Date.now() - value.createdAt;
                const secsDif = Math.floor(timeDif / 1000);
                const minsDif = Math.floor(timeDif / 60000);
                const hoursDif = Math.floor(timeDif / 3600000);
                const daysDif = Math.floor(timeDif / 86400000);
               let timeDifStr,timeUnit;
                if (secsDif < 60) {
                    timeDifStr = `${secsDif}`;
                    timeUnit = ` sec${secsDif > 1 ? 's' : ''}`;
                } else if (minsDif < 60) {
                    timeDifStr = `${minsDif}`;
                    timeUnit = ` min${minsDif > 1 ? 's' : ''}`;
                } else if (hoursDif < 24) {
                    timeDifStr = `${hoursDif}`;
                    timeUnit = ` hour${hoursDif > 1 ? 's' : ''}`;
                } else {
                    timeDifStr = `${daysDif}`;
                    timeUnit = ` day${daysDif > 1 ? 's' : ''}`;
                }
                
                let isMyTop = false;
                if (user.id.toString() == value.top_set_user_id) {
                    isMyTop = true;
                }
                return {
                    id: value.id,
                    message: value.message,
                    img: value.img,
                    imgs: value.imgs,
                    imgPath: "roomMessages/img-src/",
                    sender_id: value.sender_id,
                    sender_name: value.sender_name,
                    nickname: value.user_name,
                    email: value.email,
                    gender: value.gender,
                    online: value.online,
                    avatarUrl: value.avatarUrl,
                    timeDiff: timeDifStr,
                    timeUnit : timeUnit,
                    top: value.top,
                    top_set_user_id: value.top_set_user_id,
                    top_set_time: value.top_set_time,
                    isMyTopMsg: isMyTop,
                    is_announcement: value.is_announcement,
                    is_admin_announcement: value.is_admin_announcement,
                    createdAt: value.createdAt,
                    room_id: value.room_id
                }
            });

            let totalCommentCount = await PublicRoomMessageSchemaModel.count({where : {
                room_id: req.body.room_id, is_announcement: true
            }});
            results.totalCount = totalCommentCount;

            results.error = false;
            results.data = resultMessages;
            res.send(results);
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
        }
    },
    sendAnnouncement: async (req, res, next) => {
        const {message, posted_at, publisher, poster_email, imgs} = req.body;
        let params = {
        //     message_id: objectId,
            message: message,
            imgs: imgs,
            sender_id: req.user.id,
            sender_name: req.user.name,
            room_id: "61946f1e3e9419cb1103ed1a",
            is_announcement: true,
            is_admin_announcement: publisher == "admin" ? true : false,
            createdAt : Date.now()
        };
        if (posted_at == "top") {
            params.top = true;
            params.top_set_user_id = req.user.id;
            params.top_set_time = Date.now();
        } else
            params.top = false;
        if (poster_email) {
            params.announcement_email = poster_email;
        }
        await PublicRoomMessageSchemaModel.create(params).then(result => {
            res.json({
                success: true,
                message: 'send message successfully',
                data: result
                });
        }).catch(err => {
            res.status(401).json({
                success: false,
                message: err.message
            });
        });
    },
    uploadMultiImages: async (req, res) => {
        const files = req.files;
        const fileNames = await files.map((file) => file.filename);
        res.send({error: false, data: fileNames});
    },
    uploadMultiVideosThumb: async (req, res) => {
        const files = req.files;
        if (files) {
             const fileNames = await files.map((file) => file.filename);
             res.send({error: false, data: fileNames});
        }
        else {
             res.send({error: true, data: []});
        }
    },
    uploadMultiVideos: async (req, res) => {
        const files = req.files;
        if (files) {
             const fileNames = await files.map((file) => file.filename);
             res.send({error: false, data: fileNames});
        }
        else {
             res.send({error: true, data: []});
        }
    },
    getImgSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/public_chat_messages', req.params.imageName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
            res.status(403).send("Image doesn't exist");
        }
        else {
            res.sendFile(`${fileLocation}`);
        }
    },
    getVideoSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/public_chat_messages', req.params.videoName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
             res.status(403).send("Video doesn't exist");
        }
        else {
             res.sendFile(`${fileLocation}`);
        }
   },
   
   getVideoThumbSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/public_chat_messages', req.params.videothumbName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
             res.status(403).send("Image doesn't exist");
        }
        else {
             res.sendFile(`${fileLocation}`);
        }
   },
    deleteMessage: async (req, res, next) => {
        try {
            let id = req.body.id;
            console.log('PublicRoomsMessageController deleteMessage id : ' + id);
            await PublicRoomMessageSchemaModel.destroy({where : {id: id}});
            res.send({ error: false, data: `done ${req.body.id}` })
        } catch (err) {
            res.status(400).send({ error: true, data: `${err}` });
        } 
   },
};