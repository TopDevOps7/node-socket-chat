"use strict";
//created by Hatem Ragap
const {roomsSchemaModel} = require("../maria_models/conversionsModel");
const {userSchemaModel} = require("../maria_models/userModel");
const {messageSchemaModel} = require("../maria_models/messagesModel");
const {settingsSchemaModel} = require('../maria_models/settingsModel');
const Sentry = require("@sentry/node");
const {QueryTypes} = require('sequelize');
const connectDB = require('../config/maria_database.js');
const {Op} = require('sequelize');

module.exports = {
     createChatRoom: async (req, res) => {
          const {user_one, user_two, lastMessage} = req.body;
          if (user_two && user_one && lastMessage) {
               let msg = {
                    users_see_message: [user_one],
                    message: lastMessage,
                    updated: Date.now()
               };
               try
               {
                    // let chat = await roomsSchemaModel.findOne({where : {users: [user_one, user_two]}}); //test
                    let sqlStr = "SELECT * FROM chatsrooms WHERE JSON_CONTAINS(users, " + "'[\""+ user_one + "\",\"" + user_two +"\"]'" + ") LIMIT 1";
                    const chat = await connectDB.sequelize.query(sqlStr, {type: QueryTypes.SELECT});
                    // console.log("==================chat========= : ", chat);
                    if (chat.length == 0) {
                         //create new Conversation
                         await roomsSchemaModel.create({
                              users: [user_one, user_two], lastMessage: msg
                         }).then(result => {
                              result.messageCount = 0;
                              res.status(200).send({error: false, data: result, new: true});
                         }).catch(err => {
                              res.status(400).send({error: true, data: err});
                         });
                    } else {
                         //just send this message on this conversation and send Notification
                         await messageSchemaModel.count({where : {sender_id: user_one, receiver_id: user_two}
                         }).then(count => {
                              chat[0].messageCount = count;
                              res.status(200).send({ error: false, data: chat[0], new: false });
                         }).catch(err => {
                              chat[0].messageCount = 0;
                              // console.log("==================chat : ", chat);
                              res.status(200).send({ error: false, data: chat[0], new: false });
                              // res.status(400).send({ error: true, data: err });
                         });
                    }
               } catch (err) {
                    res.status(400).send({error: true, data: err});
               }
          } else {
               res.status(400).send({error: true, data: 'missing some args user_one user_two lastMessage'})
          }
     },
     getUserChats: async (req, res) => {
          let userId = req.body.user_id;
          if (!userId) {
               userId = req.user.id;
          }
          if (userId) {
               let listOfOnlineAndOffline = {"user 1 id ": true};
               const keys = Object.keys(listOfOnlineAndOffline);
               let result = {};
               try {
                    let sqlStr = "SELECT * FROM chatsrooms WHERE JSON_CONTAINS(users, " + "'[\""+ userId +"\"]'" + ") ORDER BY created DESC";
                    const chats = await connectDB.sequelize.query(sqlStr, {type: QueryTypes.SELECT});
                    //console.log('==========================chats:', chats);
                    const parameterSettings = await settingsSchemaModel.findOne({type: "parameter"});
                    const chatAdminEmail = parameterSettings.settings.online_chat_admin_email;
                    let chatsResult = [];
                    for (let i = 0; i < chats.length; i++)
                    {
                         let value = chats[i];
                         if (value.users.length == 2)
                         {
                              let friendId = parseInt(value.users.find((id) => id != userId.toString()));
                              let friend = await userSchemaModel.findOne({where : { id : parseInt(friendId)}, attributes: {exclude: ['token', 'originPassword', 'password']}});
                              //console.log('=======================friend:', friend);
                              let isAdminChat = false;
                              let isAdminChannel = false;
                              if (friend) {
                                   isAdminChat = friend.role === "admin";
                                   isAdminChannel = friend.role === "admin" && friend.email.toLowerCase() == chatAdminEmail.toLowerCase();
                              }
                              const timeDif = Date.now() - value.lastMessage.updated;
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
                              let messageCount = 0;
                              await messageSchemaModel.count({ where : { sender_id: userId, receiver_id:  friendId }
                              }).then(count => {
                                   messageCount = count;
                              }).catch(err => {
                                   messageCount = 0; 
                              });
                              chatsResult.push({
                                   id: value.id,
                                   friendId: friendId,
                                   friend: {...friend.dataValues},
                                   isAdminChat: isAdminChat,
                                   isAdminChannel: isAdminChannel,
                                   users: value.users,
                                   lastMessage: {...value.lastMessage, ...{timeDiff: timeDifStr , timeUnit : timeUnit }},
                                   created: value.created,
                                   createdAt: value.createdAt,
                                   updatedAt: value.updatedAt,
                                   messageCount: messageCount
                              });
                         }
                    }

                    chatsResult.sort((a, b) => {
                         if (!a.isAdminChannel && b.isAdminChannel)
                              return 1;
                         if (!a.isAdminChat && b.isAdminChat)
                              return 1;
                         return -1;
                    });
                    
                    result.error = false;
                    result.data = chatsResult;
                    result.onLineUsersId = keys;
                    console.log('====================chatsResult:', chatsResult);
                    res.send({error: false, data: chatsResult, onLineUsersId: keys})
               } catch (error) {
                    console.log(error.message);
                    result.onLineUsersId = [];
                    result.error = true;
                    result.data = `there are error ${error.message}`;
                    res.status(400).send({error: true, data: result})
               }
          } else {
               res.status(400).send({error: true, data: 'user_id is empty'})
          }
     },
     removeChatRoom: async (req, res) => {
          const {chat_id} = req.body;
          await roomsSchemaModel.destroy({where : {id : chat_id}
          }).then(result => {
               res.send({error: false, data: "Removed Successfully"});
          }).catch(err => {
               res.status(400).send({error: true, data: err.message});
          });
     },
     updateChatCount: async (req, res) => {
     try {
          const { chat_id, unread_count } = req.body;
          console.log("===================conversationsController updateChatCount chat_id:" + chat_id);
          const room = await roomsSchemaModel.findOne({where : {id : parseInt(chat_id)}});
          if (room != null) {
               let lastMessage = room.lastMessage;
               lastMessage.unread_count = parseInt(unread_count);
               console.log("===================conversationsController updateChatCount unread_count:" + unread_count);
               await roomsSchemaModel.update({ lastMessage: lastMessage }, {where : {id : parseInt(chat_id)}
               }).then(result => {
                    console.log("===================conversationsController updateChatCount Successfully");
                    res.send({ error: false, data: "Count Updated Successfully" });
               }).catch(err => {
                    res.status(400).send({ error: true, data: err.message });
               });
          }
     } catch (e) {
          Sentry.captureException(e);
          res.status(400).send({ error: true, data: e });
     } finally {
          // transaction.finish();
     }
     },
     contacts: async (req, res) => {
          await userSchemaModel.findAll({where : {[Op.not]:[{id: req.user.id}]}
          }).then(result =>{
               res.json({ success: true, result });
          });          
     },
     conversations: async (req, res) => {
          let userId = req.body.user_id;
          if (!userId && req.user) {
               userId = req.user.id.toString();
          }
          if (userId) {
               try {
                    const conversations = await roomsSchemaModel.findAll({ where : {users : userId}});
                    const conversationsResult = conversations.map(async (conversation, index) => {
                         const messages = await messageSchemaModel.findAll({
                              where : {chat_id : conversation.id}, 
                              attributes: {exclude: ['img']}
                         });
                         const users = messages.map(async (message, index) => {
                              userSchemaModel.findOne({
                                   where : { id: [message.sender_id, message.receiver_id]},
                                   attributes : ['id', 'name', 'email', 'gender', 'role', 'avatarUrl', 'online']
                              })
                         });
                         messages.users = users;
                         conversation.messages = messages;
                         return conversation;
                    });
                    res.json({
                         success: true,
                         conversations: conversationsResult
                    });
               } catch (e) {
                    res.status(400).send({ error: true, data: e });
               }
          } else {
               res.status(400).send({error: true, data: 'user_id is empty'})
          }
     },
     conversation: async (req, res) => {
          let chatId = req.body.chat_id;
          if (chatId) {
               const conversation = await roomsSchemaModel.findOne({ where : {id : chatId}});
               const messages = await messageSchemaModel.findAll({
                    where : {chat_id : conversation.id}, 
                    attributes: {exclude: ['img']}
               });
               const users = messages.map(async (message, index) => {
                    userSchemaModel.findOne({
                         where : { id: [message.sender_id, message.receiver_id]},
                         attributes : ['id', 'name', 'email', 'gender', 'role', 'avatarUrl', 'online']
                    })
               });
               messages.users = users;
               conversation.messages = messages;
               res.json({
                    success: true,
                    conversation: conversation
               });
          } else {
               res.status(400).send({error: true, data: 'chat_id is empty'})
          }
     }
};