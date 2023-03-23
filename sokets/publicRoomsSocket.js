//created by Hatem Ragap
const _ = require("underscore");
const {Op} = require('sequelize');

const { userSchemaModel } = require('../maria_models/userModel');
const {
  PublicRoomMessageSchemaModel
} = require("../maria_models/PublicRoomsMessagesModel");
// const BlockLimitedWord = require('../models/BlockLimitedWord');
// const ProhibitedWord = require('../models/ProhibitedWord');
const mongoose = require("mongoose");

function has10OrLessCJK(text) {
  return /^[\u3000\u3400-\u4DBF\u4E00-\u9FFF]{0,9}$/.test(text);
}

module.exports = io => {
  io.of("/api/joinPublicRoom").on("connection", socket => {

    let roomId;
    socket.on("joinPublicRoom", function(msg) {
      let objectValue = JSON.parse(msg);
        roomId = objectValue["roomId"];
      let user_name = objectValue["user_name"];
      socket.join(roomId);

      var clientsInRoom = io.nsps["/api/joinPublicRoom"].adapter.rooms[roomId];
      var numClients =
        clientsInRoom === undefined
          ? 0
          : Object.keys(clientsInRoom.sockets).length;

        // let w =
        //   '{"sender_name":"' + user_name +'", "numClients":"' +numClients +'"}';
      let w = {
        sender_name: user_name,
        numClients: numClients
      }
      // console.log(w);
      socket.to(roomId).emit("UserJoin", w);
    });

    socket.on("getNumOfClients", async msg => {
        var clientsInRoom = io.nsps["/api/joinPublicRoom"].adapter.rooms[msg];
        var numClients =
          clientsInRoom === undefined
            ? 0
            : Object.keys(clientsInRoom.sockets).length;
        // console.log(numClients);
        socket.to(msg).emit("onNumOfClients", numClients);
    });

    socket.on("new_comment", async msg => {
      // console.log(msg);
      let objectValue = JSON.parse(msg);
      let room_id = objectValue["room_id"];
      let sender_id = objectValue["sender_id"];
      let sender_name = objectValue["sender_name"];
      let message = objectValue["message"];
      let img = objectValue["img"];
      let imgs = objectValue["imgs"];
      let videos = objectValue["videos"];
      let videosthumb = objectValue["videosthumb"];
      let is_announcement = objectValue["is_announcement"];
      let is_admin_announcement = objectValue["is_admin_announcement"];
      let top = objectValue["top"];
      // let messageId = objectValue["messageId"];
      console.log('===============new_comment : ' + is_announcement);

      // const sender = await userSchemaModel.findOne({ where : {id : sender_id}});
      const receiverList = await userSchemaModel.findAll({
          where : {[Op.not]:[{id:sender_id}], online:true},
          attributes: {
            exclude: ['token', 'originPassword', 'password']
          }
      });

      let receiverIds = receiverList.map((value, index) => value.id);
      receiverIds.push(sender_id);

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

      await PublicRoomMessageSchemaModel.create({
        message: message,
        sender_id: sender_id,
        sender_name: sender_name,
        img: img,
        imgs: imgs,
        videos: videos,
        videosthumb: videosthumb,
        room_id: room_id,
        receiver_ids: receiverIds,
        is_announcement,
        is_admin_announcement,
        top,
        createdAt : Date.now()
      }).then(publicRoomMessage => {
        let user = {};
        try {
          user = userSchemaModel.findOne({
            where: {id : sender_id},
            attributes : {
              exclude: ['token', 'originPassword', 'password']
            }
          });
        } catch(err) {}
        const timeDif = Date.now() - publicRoomMessage.createdAt;
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

        let w = {
          message: publicRoomMessage.message,
          img: publicRoomMessage.img,
          imgs: publicRoomMessage.imgs,
          imgPath: "roomMessages/img-src/",
          videos: videos,
          videosthumb: videosthumb,
          sender_id: publicRoomMessage.sender_id,
          sender_name: publicRoomMessage.sender_name,
          nickname: user.name,
          gender: user.gender,
          email: user.email,
          online: user.online,
          avatarUrl: user.avatarUrl,
          room_id: publicRoomMessage.room_id,
          timeDiff: timeDifStr,
          timeUnit : timeUnit,
          createdAt: publicRoomMessage.createdAt,
          receiver_ids: receiverIds
        }
  
        console.log(w);
        // socket.emit("onNewComment", w);
        socket.to(room_id).broadcast.emit("RoomMsgReceive", w);
      });
    });
    
    socket.on("deletePublicMessageEveryone", async (data) => {
      try {
        if (data.id) {
          let msgId = data.id;
          let msgDetails = await PublicRoomMessageSchemaModel.findOne({where : {id : msgId}});
          if (msgDetails) {
            socket.to(msgDetails.room_id).broadcast.emit("RoomMessageDelete", data.id);
            await PublicRoomMessageSchemaModel.destroy({ where : { id: data.id }});
            callback && callback({error : false , data: "message_deleted" })
          } else {
            callback && callback({error : false , data: "message_not_found_in_db" })
            socket.to(msgDetails.room_id).broadcast.emit("RoomMessageDelete", data.id);
          }
        } else {
          callback && callback({error : true , data: "id_not_found" })
        }
      } catch (err) {
        socket.to(msgDetails.room_id).broadcast.emit("RoomMessageDelete", data.id);
        //socket.to(chatId).broadcast.emit("onDeleted", false);
      }
    });
    socket.on("disconnect", socket => {
      console.log("a user is Disconnected from Public Room ");
    });
  });
};
