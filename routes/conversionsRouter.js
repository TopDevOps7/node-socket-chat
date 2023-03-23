"use strict";
//created by Hatem Ragap
const express = require("express");
const conversionsRouter = new express.Router();
const conversionsController = require('../maria_controllers/conversionsController');
const { verifyToken } = require('../middlewares/authHandler');

conversionsRouter.post("/create", verifyToken, conversionsController.createChatRoom);
conversionsRouter.route('/conversations').post(verifyToken, conversionsController.conversations);
conversionsRouter.route('/conversation').post(verifyToken, conversionsController.conversation);
conversionsRouter.route('/contacts').get(verifyToken, conversionsController.contacts);
conversionsRouter.post("/getUserChats", verifyToken, conversionsController.getUserChats);
conversionsRouter.post("/remove", verifyToken, conversionsController.removeChatRoom);
conversionsRouter.post("/updateChatCount", verifyToken, conversionsController.updateChatCount);

// conversionsRouter.route('/search').get(verifyToken, conversionsController.search);
// conversionsRouter.route('/participants').get(conversionsController.participants);
// conversionsRouter.route('/conversation/mark-as-seen').get(conversionsController.conversationMarkAsSeen);
// conversionsRouter.route('/messages/new').post(conversionsController.newMessage);

module.exports = conversionsRouter;