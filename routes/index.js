var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('', function(req, res, next) {
  res.render('home.ejs');
});

router.get('/about', function(req, res, next) {
    res.render('about.ejs');
});

router.get('/offline', function(req, res, next) {
  res.render('offline.ejs');
});

router.get('/online-home', function(req, res, next) {
  router.roomName = req.query.roomName;
  res.render('online_home.ejs');
});

router.get('/online/online-rooms', function(req, res, next) {
  router.roomName = req.query.roomName;
  res.render('online_rooms.ejs');
});

router.get('/online/online-rooms', function(req, res, next) {
  router.roomName = req.query.roomName;
  res.render('online_rooms.ejs');
});

router.get('/wating', function(req, res, next) {
  res.render('wating.ejs');
});

module.exports = router;