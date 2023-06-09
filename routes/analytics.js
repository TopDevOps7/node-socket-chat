const express = require('express');
const router = express.Router();
const { userSchemaModel } = require('../maria_models/userModel');
const { logsSchemaModel } = require('../maria_models/logsModel');
const gplay = require('google-play-scraper');

router.get('/', async (req, res) => {
  const total_user = await userSchemaModel.count({where : {status: "active"}});
  const registered_user = await userSchemaModel.count();
  const online_visitor = await userSchemaModel.count({where:{online: true}});
  const statistics = await gplay.app({ appId: 'com.google.android.apps.translate' });

  res.json({
    total_user,
    registered_user,
    online_visitor,
    statistics
  });
});

router.get('/logs/:date', async (req, res) => {
  const date = new Date(req.params.date);
  const logs = await logsSchemaModel.findOne({ where : {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}});
  if (logs) {
    res.json({
      error: false,
      logs: logs,
      msg: "success"
    });
  }
  else {
    res.json({ error: true, data: "Not exist", msg: "none"});
  }
});

router.get('/logs/:from/:to', async (req, res) => {
  const fromDate = new Date(req.params.from);
  const toDate = new Date(req.params.to);
  const logs = await logsSchemaModel.findAll({ where : {
    date: {
        $gte: fromDate, 
        $lt: new Date(toDate.getTime() + 1000 * 60 * 60 * 24)
    }
  }})
  if (logs) {
    res.json({
      error: false,
      logs: logs,
      msg: "success"
    });
  }
  else {
    res.json({ error: true, data: "Not exist", msg: "none"});
  }
});

module.exports = router;
