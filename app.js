var express = require('express')
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var socket_online_home = require('./socket_server/soket_online_home')
var socket_online_rooms = require('./socket_server/socket_game_rooms')
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
var arrayRooms = [];

app.use("/static", express.static(path.join(__dirname, `public`)));
app.use("/images", express.static(path.join(__dirname, `public`, `images`)));
app.use("/online/images", express.static(path.join(__dirname, `public`, `images`)));

app.use(logger('dev'));
app.set("view engine", "ejs");
app.use('/', indexRouter);
const online = io.of('/online-home')
socket_online_home(online, arrayRooms)

const online_rooms = io.of('/online/online-rooms')
// const online_rooms = io.of('/online-home')

socket_online_rooms(online_rooms, indexRouter, arrayRooms)

var port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`App listenting on port: ${port}`);
})