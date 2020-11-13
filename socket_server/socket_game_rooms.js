
socket_game_rooms = (online, indexRouter, arrayRooms) =>{
var colorGo = "den";
online.on(`connection`, function(socket){

    let roomName = indexRouter.roomName

  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    console.log("disconnecting: ", rooms);
  });




  socket.on(`disconnect`, (reason) => {
    if(reason == "transport close"){
      for(var i = arrayRooms.length - 1; i >= 0 ; i--){
        if(arrayRooms[i].name == roomName){
          arrayRooms[i].size -= 1
          if(arrayRooms[i].size == 0) arrayRooms.splice(i,1)
          else online.to(roomName).emit("server-reset-player");
        }
      }
    }
    if(reason == "transport error"){
      online.to(roomName).emit("server-sent-player-transport-error");
    }
    if(reason == "ping timeout"){
      for(var i = arrayRooms.length - 1; i >= 0 ; i--){
        if(arrayRooms[i].name == roomName){
          arrayRooms[i].size -= 1
          if(arrayRooms[i].size == 0) arrayRooms.splice(i,1)
          else online.to(roomName).emit("server-reset-player");
        }
      }
    }
    console.log("Reson  -  "+reason);
  })

  socket.on('error', (error) => {
    console.log("error: "+error);
  });

  let rooms = online.adapter.rooms[roomName];

  if(rooms == undefined || rooms.length < 2){
    socket.join(roomName);
    if(rooms == undefined){
      online.to(roomName).emit("server-send-color","w");
    }
    else{
      online.to(roomName).emit("server-send-color","b");
      // setTimeout(() => socket.disconnect(true), 5000);
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