const cron = require('node-cron');
const dateFormat = require('date-format');
const { logsSchemaModel } = require("./maria_models/logsModel");
const { userSchemaModel } = require("./maria_models/userModel");
const { settingsSchemaModel } = require("./maria_models/settingsModel");
const { PublicRoomMessageSchemaModel } = require("./maria_models/PublicRoomsMessagesModel");
const { UserSpecialPermssionSchemaModel } = require("./maria_models/UserSpecialPermssionModel");

let logsTask;
let cronTask;

const createCronJob = () => {
    // every day 23:59 register log - calculate statistics
    logsTask = cron.schedule('01 00 * * *', async function() {
        //console.log('running a task every day 23:59', dateFormat('yyyy.MM.dd hh:mm:ss.SSS', new Date()));
        try {
            const active_user_num = await userSchemaModel.count({where : {status: "active"}});
            const register_user_num = await userSchemaModel.count();
            const online_user_num = await userSchemaModel.count({where : {online: true}});
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const log_time = date.getTime()
            if (await logsSchemaModel.findOne({year,month,day})) {
              //console.log(`already logged: ${year}-${month}-${day}`);
              return;
            }
            await logsSchemaModel.create({
              date,
              log_time,
              online_user_num: online_user_num,
              register_user_num: register_user_num,
              year: year,
              month: month,
              day: day
            });
        } catch(err) {
            console.error(err.message);
        }
    });

    // every minute task
    cronTask = cron.schedule('* * * * *', async function() {
      const curDate = new Date();
      // console.log('running a task every minute', dateFormat('yyyy.MM.dd hh:mm:ss.SSS', curDate));
      try {
        const parameterSettings = await settingsSchemaModel.findOne({where : {type: "parameter"}});
        const expireHour = (parameterSettings && parameterSettings.settings.top_message_save_hour) || 24;
        // announcement expire
        const announcements = await PublicRoomMessageSchemaModel.findAll({where : {is_announcement: true}});
        for (let i = 0; i < announcements.length; i++) {
          const createTime = announcements[i].createdAt;
          if (curDate.getTime() - createTime > expireHour * 3600 * 1000) {
            await PublicRoomMessageSchemaModel.destroy({where : {id : announcements[i].id}});
          }
        }
        // top messages expire
        const topMessages = await PublicRoomMessageSchemaModel.findAll({where : {top: true}});
        for (let j = 0; j < topMessages.length; j++) {
          const element = topMessages[j];
          const topSetTime = element.top_set_time;
          if (curDate.getTime() - topSetTime > expireHour * 3600 * 1000) {
            await PublicRoomMessageSchemaModel.update({top: false}, {where : {id : element.id}});
          }
        }
        // public message expire
        const messageExpireHour = (parameterSettings && parameterSettings.settings.message_save_hour) || 30 * 24;
        const publicMessages = await PublicRoomMessageSchemaModel.findAll({where : {top: false}});
        for (let j = 0; j < publicMessages.length; j++) {
          const element = publicMessages[j];
          const createTime = element.createdAt;
          if (curDate.getTime() - createTime > messageExpireHour * 3600 * 1000) {
            await PublicRoomMessageSchemaModel.destroy({where : {id : element.id}});
          }
        }
        // user special permissio expire
        const expiredPerms = await UserSpecialPermssionSchemaModel.findAll({where : { expire_time: { $lt: Date.now() } }});
        for (let k = 0; k < expiredPerms.length; k++) {
          const element = expiredPerms[k];
          await UserSpecialPermssionSchemaModel.destroy({where : {id : element.id}});
        }
      } catch(err) {
        console.error(err.message);
      }
  });
};

const initCron = async () => {
  createCronJob();
};

const stopCron = async () => {
  await logsTask.stop();
  await cronTask.stop();
};

module.exports = {
  initCron,
  stopCron
};