"use strict";
//created by Hatem Ragap

// message type 0 mean is only String in flutter ignore img field
// message type 1  mean is only Img in flutter ignore message field
const path = require('path');
const fs = require('fs');
const {messageSchemaModel} = require("../maria_models/messagesModel");

module.exports = {
    //limit of messages is 100
     fetchAll: async (req, res, next) => {
          let results = {};
          const page = parseInt(req.body.page);
          const limit = 100;
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;

          console.log('=========================messageController fetchAll:', req.body);
          await messageSchemaModel.findAll({
               where : { chat_id: parseInt(req.body.chat_id)},
               attributes : ['id', 'message', 'imgs', 'videos', 'videosthumb', 'message_type', 'createdAt', 'sender_id', 'receiver_id', 'isDeleted'],
               order : [
                    ['createdAt', 'DESC']
               ],
               offset: startIndex,
               limit: limit,
          }).then(async messages => {
               console.log('========================messages:', messages);
               const resultMessages = await messages.map((value, index) => {
                    let createdAt = value.createdAt;
                    let createDate = new Date(createdAt * 1000);
                    let send_date = (createDate.getMonth() + 1) + "-" + createDate.getDate();
                    let send_time = createDate.getHours() + ":" + createDate.getMinutes();

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
                         message_type: value.message_type,
                         imgs: value.imgs,
                         videos: value.videos,
                         videosthumb: value.videosthumb,
                         isDeleted: value.isDeleted,
                         sender_id: value.sender_id,
                         receiver_id: value.receiver_id,
                         send_date: send_date,
                         send_time: send_time,
                         timeDiff: timeDifStr,
                         timeUnit : timeUnit,
                         createdAt: value.createdAt,
                    }
               });
     
               let totalCommentCount = await messageSchemaModel.count({where : {chat_id: req.body.chat_id}})
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
          }).catch(err=>{
               console.log('========================messages error:', err);
               results.error = false;
               results.data = [];
               res.send(results);
          });
     },

    uploadMessageImageOnly: async (req, res) => {
        let imgName = req.file.filename;
        res.send({error: false, data: imgName});
    },

    deleteMessageById: async (req, res) => {

        try {
          await messageSchemaModel.destroy({where : {id : req.body.id}});

            res.send({error: false, data: 'done'})
        } catch (err) {
            res.status(400).send({error: true, data: `${err}`});
        }

    },
    
    deleteMessageEveryone: async (req, res) => {
          console.log('==================deleteMessageEveryone id : ' + req.body.id);
          try {
               await messageSchemaModel.destroy({where : {id : req.body.id}});

               res.send({ error: false, data: 'done' })
          } catch (err) {
               res.status(400).send({ error: true, data: `${err}` });
          }

    },
    
    uploadMultiImages: async (req, res) => {
        const files = req.files;
        if (files) {
            const fileNames = await files.map((file) => file.filename);
            res.send({error: false, data: fileNames});
        }
        else {
            res.send({error: true, data: []});
        }
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
        let fileLocation = path.resolve(__dirname, '../uploads/users_messages_img', req.params.imageName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
            res.status(403).send("Image doesn't exist");
        }
        else {
            res.sendFile(`${fileLocation}`);
        }
    },

    getVideoSrc: async (req, res) => {
          let fileLocation = path.resolve(__dirname, '../uploads/users_messages_video', req.params.videoName);
          let fileExist = fs.existsSync(fileLocation)
          if(!fileExist) {
               res.status(403).send("Video doesn't exist");
          }
          else {
               res.sendFile(`${fileLocation}`);
          }
     },
     
     getVideoThumbSrc: async (req, res) => {
          let fileLocation = path.resolve(__dirname, '../uploads/users_messages_video', req.params.videothumbName);
          let fileExist = fs.existsSync(fileLocation)
          if(!fileExist) {
               res.status(403).send("Image doesn't exist");
          }
          else {
               res.sendFile(`${fileLocation}`);
          }
     },

     sendMessage: async (req, res, next) => {
          const {messageId, message, senderId, receiverId, chatId, messageType, imgs, videos} = req.body;
          await messageSchemaModel.create({
               id: messageId,
               message: message,
               sender_id: senderId,
               receiver_id: receiverId,
               chat_id: chatId,
               message_type: messageType,
               imgs: imgs,
               videos: videos
          }).then(result => {
               res.json({
                    success: true,
                    message: 'send message successfully',
                    data: messageSchema
               });
          }).catch(err => {
               res.status(401).json({
                    success: false,
                    message: err.message
               });
          });
     },
};
