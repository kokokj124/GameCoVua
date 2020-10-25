var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('', function(req, res, next) {
  res.render('offline.ejs');
});

router.get('/online', function(req, res, next) {
  router.roomName = req.query.roomName;
  res.render('online.ejs');
});

module.exports = router;
