
socket_game_rooms = (online, indexRouter, arrayRooms) =>{
var colorGo = "den";
online.on(`connection`, function(socket){
  let roomName = indexRouter.roomName
  let rooms = online.adapter.rooms[roomName];

  socket.on('disconnecting',reason=>{
    for(var i = arrayRooms.length - 1; i >= 0 ; i--){
      if(arrayRooms[i].name == roomName){
        arrayRooms[i].size -= 1
        if(arrayRooms[i].size == 0) arrayRooms.splice(i,1)
        else online.to(roomName).emit("server-reset-player");
      }
    }
    // online.to(roomName).emit("server-send-color");
  })

  if(rooms == undefined || rooms.length < 2){
    socket.join(roomName);
    if(rooms == undefined){
      online.to(roomName).emit("server-send-color","w");
    }
    else{
      online.to(roomName).emit("server-send-color","b");
    }
    socket.on("client-send-data", data=>{
      online.to(roomName).emit("server-send-data", data);
      if( colorGo == "trang"){
        online.to(roomName).emit("server-send-colorGo", colorGo);
        colorGo = "den"
      }
      else{
        online.to(roomName).emit("server-send-colorGo", colorGo);
        colorGo = "trang"
      }
      })
  }
})
}
module.exports = socket_game_rooms