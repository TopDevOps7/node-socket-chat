'use strict';
//created by Hatem Ragap
const express = require('express');
const roomMessageRouter = new express.Router;
const roomMessageController = require('../maria_controllers/PublicRoomsMessageController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/public_chat_messages',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const multiStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/public_chat_messages')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const multiStorageVideo = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/public_chat_messages')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage: storage});
const multiUpload = multer({storage: multiStorage});
const multiUploadVideo = multer({storage: multiStorageVideo});

const { verifyToken } = require('../middlewares/authHandler');

roomMessageRouter.post('/announcement', verifyToken, roomMessageController.sendAnnouncement);
roomMessageRouter.post('/upload_multi_imgs', verifyToken, multiUpload.any('img'), roomMessageController.uploadMultiImages);
roomMessageRouter.post('/upload_multi_videos', verifyToken, multiUploadVideo.any('video'), roomMessageController.uploadMultiVideos);
roomMessageRouter.post('/upload_multi_videosthumb', verifyToken, multiUploadVideo.any('img'), roomMessageController.uploadMultiVideosThumb);
roomMessageRouter.post('/fetchAll', verifyToken, roomMessageController.fetchAll);
roomMessageRouter.post('/fetchTop/:userId', verifyToken, roomMessageController.fetchTop);
roomMessageRouter.get('/img-src/:imageName', roomMessageController.getImgSrc);
roomMessageRouter.get('/video-src/:videoName', roomMessageController.getVideoSrc);
roomMessageRouter.get('/video-thumb/:videothumbName', roomMessageController.getVideoThumbSrc);
roomMessageRouter.post('/delete', verifyToken, roomMessageController.deleteMessage);

/*
roomMessageRouter.post('/setTopMsg/:msgId/:userId', verifyToken, roomMessageController.setTopMessage);
roomMessageRouter.post('/cancelTopMsg/:msgId/:userId', verifyToken, roomMessageController.cancelTopMessage);
roomMessageRouter.post('/send', verifyToken, roomMessageController.sendMessage);
roomMessageRouter.post('/upload_img_message', verifyToken, upload.single('img'), roomMessageController.uploadMessageImageOnly);
roomMessageRouter.get('/img-srcV2/:imageName', roomMessageController.getImgSrcV2);
*/

module.exports = roomMessageRouter;
