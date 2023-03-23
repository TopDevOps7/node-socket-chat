"use strict";
//created by Hatem Ragap
const express = require("express");
const notificationsRouter = new express.Router();
const notificationsController = require('../maria_controllers/notificationController');


notificationsRouter.post("/fetch_all", notificationsController.getNotifications);
notificationsRouter.post("/push", notificationsController.sendPushNotification);

module.exports = notificationsRouter;
