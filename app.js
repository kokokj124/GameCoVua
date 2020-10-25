var express = require('express')
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);

const online = io.of('/online')


// const io = require('socket.io')(server, {
//   path: '/online',
//   serveClient: false,
//   // below are engine.IO options
//   // pingInterval: 10000,
//   // pingTimeout: 5000,
//   cookie: false
// });

app.use("/static", express.static(path.join(__dirname , `public`)));
app.use("/images", express.static(path.join(__dirname , `public`, `images`)));

app.use(logger('dev'));
app.set("view engine", "ejs");

app.use('/', indexRouter);

var colorGo = "den";
online.on(`connection`, function(socket){
  // const online = socket.nsp;

  let rooms = online.adapter.rooms[indexRouter.roomName];
  
  if(rooms == undefined || rooms.length < 2){
    socket.join(indexRouter.roomName);
    if(rooms == undefined){
      online.to(indexRouter.roomName).emit("server-send-color","w");
    }
    else{
      console.log(rooms.length)
      online.to(indexRouter.roomName).emit("server-send-color","b");
    }

    socket.on("client-send-data", data=>{
      online.to(indexRouter.roomName).emit("server-send-data", data);
      if( colorGo == "trang"){
        online.to(indexRouter.roomName).emit("server-send-colorGo", colorGo);
        colorGo = "den"
      }
      else{
        online.to(indexRouter.roomName).emit("server-send-colorGo", colorGo);
        colorGo = "trang"
      }
      })
  }
})




port = process.env.port || 3000
server.listen(  port, ()=>{
  console.log(`App listenting on port: ${port}`);
})
