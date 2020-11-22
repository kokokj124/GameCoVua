socket_online_home = (online, arrayRooms) => {
    online.on(`connection`, function (socket) {

      // var connectedClients = Object.keys(online.clients().connected);
      // console.log(connectedClients);

        //creat phong
        // console.log(arrayRooms);
        online.emit('server-send-list-rooms', { arrayRooms: arrayRooms });
        socket.on('client-create-rooms', data => {
          if (arrayRooms.findIndex(e=>e.name == data) == -1){
            let room = {name:data, users:["w"], sate:"none", socketId:[]}
            arrayRooms.push(room)
            online.emit('server-send-list-rooms', { arrayRooms: arrayRooms});
            socket.emit('server-accset-rooms', data)
          }
          
          else {
            socket.emit('server-send-list-rooms', { arrayRooms: "error" });
          }
        })

        socket.on('client-check-rooms',data=>{
          let flag = false
          arrayRooms.forEach(element => {
            if(element.name == data && element.users.length == 1){
              element.users.push("b");
              flag = true
              socket.emit('server-check-rooms',"allow")
              online.emit('server-send-list-rooms', { arrayRooms: arrayRooms });
            }
          });
          if(flag == false)
          socket.emit('server-check-rooms',"error")
        })   
      })
}
module.exports = socket_online_home