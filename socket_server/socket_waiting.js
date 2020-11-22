socket_waiting = (online, arrayRooms) => {
    var randomRoom = 1;
    online.on(`connection`, function (socket) {
        let rooms = online.adapter.rooms[randomRoom];
        console.log(socket.id);
        console.log(rooms);
        if (rooms == undefined || rooms.length < 2) {
            socket.join(randomRoom);
            if (rooms == undefined) {
                let room = { name:randomRoom, users:["w"], sate:"none", socketId:[] }
                arrayRooms.push(room)
            }
            else{
                console.log("1");
                arrayRooms.forEach(element => {
                    if (element.name == randomRoom && element.users.length == 1) {
                        element.users.push("b");
                        console.log("b");
                    }
                })
                console.log("aaaaaa");
                online.to(randomRoom).emit("server-direction",randomRoom);
                randomRoom += 1
            }
        }
    });
}
module.exports = socket_waiting
