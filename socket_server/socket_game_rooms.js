
socket_game_rooms = (online, indexRouter, arrayRooms) => {
  online.on(`connection`, function (socket) {
    let roomName = indexRouter.roomName

    // socket.on('disconnecting', (reason) => {
    //     // var roster = online.sockets.clients(roomName);
    //     // let rooms = Object.keys(socket.rooms);
    //     // console.log("disconnecting: ", rooms);
    // });

    socket.on(`disconnect`, (reason) => {
      if (reason == "transport close") {
        for (var i = arrayRooms.length - 1; i >= 0; i--) {
          if (arrayRooms[i].name == roomName) {
            arrayRooms[i].users.pop()
            indexSocketID = arrayRooms[i].socketId.indexOf(socket.id)
            if (indexSocketID > -1) arrayRooms[i].socketId.splice(indexSocketID, 1)
            if (arrayRooms[i].users.length == 0) {
              arrayRooms.splice(i, 1)
            }
            else online.to(roomName).emit("server-reset-player");
          }
        }
      }

      if (reason == "transport error") {
        online.to(roomName).emit("server-sent-player-transport-error");
      }

      if (reason == "ping timeout") {
        for (var i = arrayRooms.length - 1; i >= 0; i--) {
          if (arrayRooms[i].name == roomName) {
            arrayRooms[i].users.splice(arrayRooms[i].users.length, 1)
            if (arrayRooms[i].users.length == 0) arrayRooms.splice(i, 1)
            else online.to(roomName).emit("server-reset-player");
          }
        }
      }
      console.log("Reson  -  " + reason);
    })

    socket.on('error', (error) => {
      console.log("error: " + error);
    });

    let rooms = online.adapter.rooms[roomName];
    if (rooms == undefined || rooms.length < 2) {
      socket.join(roomName);
      for (var i = arrayRooms.length - 1; i >= 0; i--) {
        if (arrayRooms[i].name == roomName && arrayRooms[i].users.length <= 2) {
          arrayRooms[i].socketId.push(socket.id)
          console.log("socket ID: "+ arrayRooms[i].socketId);
        }
      }
    }

    for (var i = arrayRooms.length - 1; i >= 0; i--) {
      if (arrayRooms[i].name == roomName && arrayRooms[i].users.length == 2) {
        online.to(arrayRooms[i].socketId[0]).emit("server-send-color", "b");
        online.to(arrayRooms[i].socketId[1]).emit("server-send-color", "w");
      }
    }

    socket.on("client-send-data", data => {
      online.to(roomName).emit("server-send-data", data);
    })

  })
}
module.exports = socket_game_rooms