//created by Hatem Ragap
const _ = require("underscore");
const {QueryTypes} = require('sequelize');

const {messageSchemaModel} = require("../maria_models/messagesModel");
const {userSchemaModel} = require("../maria_models/userModel");
const {roomsSchemaModel} = require("../maria_models/conversionsModel");
const connectDB = require('../config/maria_database.js');
// const BlockLimitedWord = require('../models/BlockLimitedWord');
// const ProhibitedWord = require('../models/ProhibitedWord');

function has10OrLessCJK(text) {
    return /^[\u3000\u3400-\u4DBF\u4E00-\u9FFF]{0,9}$/.test(text);
}

module.exports = io => {
    // var admin = require("firebase-admin");

    io.of("/api/message").on("connection", socket => {
        //console.log('api/message connection');
        socket.on("makeLastMessageAsSeen", async msg => {
            let objectValue = await JSON.parse(msg);
            let chatId = objectValue["chatId"];
            let userId = objectValue["userId"];
            console.log('======================makeLastMessageAsSeen chatId:' + chatId + ' userId:' + userId);
            let chat = await roomsSchemaModel.findOne({where : {id : chatId}});
            console.log('======================makeLastMessageAsSeen chat:', chat);
            if (chat) {
                chat.lastMessage.users_see_message.push(userId);
                chat.lastMessage.unread_count = 0;
                await roomsSchemaModel.update(chat, {where : {id : chatId}});
                console.log('======================makeLastMessageAsSeen update');
            }
            io.of("/api/chatRoomList").emit("updateChatRoomList");
        });

        let chatId;
        socket.on("joinChat", async msg => {
            console.log("======================joinChat:", msg);
            let objectValue = await JSON.parse(msg);
            chatId = objectValue["chatId"];
            socket.join(chatId);
        });

        socket.on("getNumberofConnectedUsersToThisRoom", async chatId => {
            console.log('======================getNumberofConnectedUsersToThisRoom:', chatId);
            var clientsInRoom = io.nsps["/api/message"].adapter.rooms[chatId];
            var numClients =
                clientsInRoom === undefined
                    ? 0
                    : Object.keys(clientsInRoom.sockets).length;

            socket.to(chatId).emit("numberOfConenctedUsers", numClients);
        });

        socket.on("deleteMessage", async id => {
            console.log('======================deleteMessage', id);
            try {
                await messageSchemaModel.update({isDeleted: 1}, {where : {id : id}});
                socket.to(chatId).broadcast.emit("onDeleted", id);
            } catch (err) {
                socket.to(chatId).broadcast.emit("onDeleted", false);
            }
        });
        
        socket.on("deleteMessageEveryone", async (data) => {
            console.log('======================deleteMessageEveryone', data);
            try {
                await messageSchemaModel.detroy({where : {id: data.id}});
                socket.to(chatId).broadcast.emit("onDeleted", data.id); 
                try{
                    socket.to(data.receiverId).broadcast.emit("onDeleted", data.id);    
                }
                catch { }                
            } catch (err) {
                socket.to(chatId).broadcast.emit("onDeleted", false);
            }
        });

        socket.on("new_message", async msg => {
            console.log('======================new_message msg:', msg);
            let objectValue = JSON.parse(msg);
            let sender_id = objectValue["sender_id"];
            let sender_name = objectValue["sender_name"];
            // let messageId = objectValue["messageId"];
            let chat_id = objectValue["chat_id"];
            let message = objectValue["message"];
            let receiver_id = objectValue["receiver_id"];

            let message_type = objectValue["message_type"];
            let imgs = objectValue["imgs"];
            let videos = objectValue["videos"];
            let videosthumb = objectValue["videosthumb"];
            // message forbidden words replace with ***
            // const prohibitedwordsList = await ProhibitedWord.find().select({'word': 1});
            // const prohibitedwords = await prohibitedwordsList.map((value) => value.word.toLowerCase());
            // const limitblockwordsList = await BlockLimitedWord.find().select({'word': 1});
            // const limitblockwords = await limitblockwordsList.map((value) => value.word.toLowerCase());
            // const limitblockwords = [];
            // const forbiddenWords = [...prohibitedwords, ...limitblockwords];
            // let lcmessage = message.toLowerCase();
            // for (let i = 0; i < forbiddenWords.length; i++) {
            //     const word = forbiddenWords[i];
            //     let replaceString = '';
            //     for (let j = 0; j < word.length; j++) {
            //         replaceString = replaceString.concat('*');
            //     }
            //     if (has10OrLessCJK(word)) {     // if chinese word
            //         // console.log(word, replaceString);
            //         lcmessage = lcmessage.replace(new RegExp(`${word}`, 'g'), replaceString);
            //     }
            //     else {
            //         lcmessage = lcmessage.replace(new RegExp(`\\b${word}\\b`, 'g'), replaceString);
            //     }
            // }
            // for (let j = 0; j < lcmessage.length; j++) {
            //     if (lcmessage[j] == '*') {
            //         let a = message.split("");
            //         a[j] = '*';
            //         message = a.join("");
            //     }
            // }

            // let model = messageSchemaModel({
            //     _id: messageId,
            //     message: message,
            //     sender_id: sender_id,
            //     receiver_id: receiver_id,
            //     chat_id: chat_id,
            //     message_type: message_type,
            //     imgs: imgs
            // });

            // model.save(async function (err, data) {
            //     if (err) {
            //         //console.log("error is " + err);
            //     } else {
            //         // for new item override this  ,"message_type":"' + message_type + '"
            //         let createDate = new Date(data.created * 1000);
            //         let send_date = (createDate.getMonth() + 1) + "-" + createDate.getDate();
            //         let send_time = createDate.getHours() + ":" + createDate.getMinutes();
            //         let w = {
            //             _id: data._id,
            //             message: message,
            //             message_type: message_type,
            //             imgs: imgs,
            //             isDeleted: data.isDeleted,
            //             sender_id: sender_id,
            //             receiver_id: receiver_id,
            //             send_date: send_date,
            //             send_time: send_time,
            //             created: data.created,
            //             chat_id: chat_id,
            //         };
            //         socket.to(chat_id).broadcast.emit("msgReceive", w);
            //     }
            // });
            await messageSchemaModel.create({
                // id: messageId,
                message: message,
                sender_id: sender_id,
                receiver_id: receiver_id,
                chat_id: parseInt(chat_id),
                message_type: message_type,
                imgs: imgs,
                videos: videos,
                videosthumb: videosthumb,
                createdAt : Date.now()
            }).then(result => {
                // for new item override this  ,"message_type":"' + message_type + '"
                let createDate = new Date(result.createdAt * 1000);
                let send_date = (createDate.getMonth() + 1) + "-" + createDate.getDate();
                let send_time = createDate.getHours() + ":" + createDate.getMinutes();
                const timeDif = Date.now() - result.createdAt;
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

                console.log('=======================new message id : ' + result.id);
                let w = {
                    id: result.id,
                    message: message,
                    message_type: message_type,
                    imgs: imgs,
                    videos: videos,
                    videosthumb: videosthumb,
                    isDeleted: result.isDeleted,
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    send_date: send_date,
                    send_time: send_time,
                    timeDiff: timeDifStr,
                    timeUnit : timeUnit,
                    createdAt: result.createdAt,
                    chat_id: parseInt(chat_id),
                };
                socket.to(chat_id).broadcast.emit("msgReceive", w);
            })

            var clientsInRoom = io.nsps["/api/message"].adapter.rooms[chat_id];
            var numClients =
                clientsInRoom === undefined
                    ? 0
                    : Object.keys(clientsInRoom.sockets).length;

            if (numClients === 2) {
                let msgN = {
                    users_see_message: [sender_id, receiver_id],
                    message: message,
                    unread_count: 0
                };
                await roomsSchemaModel.update(
                    {
                        createdAt: Date.now(),
                        lastMessage: msgN
                    }, 
                    {
                        where : {id : parseInt(chat_id)}
                    }
                );
            } else {
                // let chat = await roomsSchemaModel.findOne({users: {$all: [receiver_id, sender_id]}});
                let sqlStr = "SELECT * FROM chatsrooms WHERE JSON_CONTAINS(users, " + "'[\""+ receiver_id + "\",\"" + sender_id +"\"]'" + ") LIMIT 1";
                const chat = await connectDB.sequelize.query(sqlStr, {type: QueryTypes.SELECT});

                console.log('=====================new_message chat:', chat);
                // try {
                //     let peerUserData = await userSchemaModel.findOne({where : {id : sender_id}});
                //     let recieverUserData = await userSchemaModel.findOne({where : {id : receiver_id}});
                //     var payload = {
                //         notification: {
                //             body: `${message}`,
                //             title: `${sender_name} sent a message`,
                //         },
                //         data: {
                //             "img": `${peerUserData["img"]}`,
                //             "name": `${peerUserData["user_name"]}`,
                //             "id": `${peerUserData["id"]}`,
                //             "chatId": `${chat['id']}`,
                //             "deviceToken": `${recieverUserData["deviceToken"]}`,
                //             "screen": "chat",
                //             'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                //         },
                //     };

                //     var options = {
                //         priority: "high",
                //         timeToLive: 60 * 60 * 24
                //     };
                //     admin
                //         .messaging()
                //         .sendToDevice(recieverUserData.deviceToken, payload, options)
                //         .then(function (ress) {
                //         })
                //         .catch(function (err) {
                //             console.log("error is " + err);
                //         });
                // } catch {
                // }

                if (chat.length > 0)
                {
                    let msgN = {
                        users_see_message: [sender_id],
                        message: message,
                        unread_count: chat[0].lastMessage.unread_count + 1,
                        updated: Date.now()
                    };
                    await roomsSchemaModel.update(
                        {
                            createdAt: Date.now(),
                            lastMessage: msgN
                        }, 
                        {
                            where : {id : parseInt(chat_id)}
                        }
                    );
                }
            }

            io.of("/api/chatRoomList").emit("updateChatRoomList");
        });

        socket.on("typing", async msg => {
            console.log('======================typing:', msg);
            let objectValue = JSON.parse(msg);
            let sender_id = objectValue["sender_id"];
            let chat_id = objectValue["chat_id"];
            socket.to(chat_id).broadcast.emit("onTyping", sender_id);
        });

        socket.on("disconnect", () => {
            console.log('======================disconnect');
            socket.to(chatId).emit("numberOfConenctedUsers", 1);
        });

        socket.on("leaveChat", async msg => {
            console.log("======================leaveChat", msg);
            let objectValue = await JSON.parse(msg);
            chatId = null;
            socket.leave(objectValue["chatId"]);
        });
    });
};
