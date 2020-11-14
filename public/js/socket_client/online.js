var socket = io("127.0.0.1:3000/online-home")
// var socket = io("https://vu-nam.herokuapp.com/online-home")


socket.on('server-send-list-rooms',data =>{
    if(data.arrayRooms != "error"){
        $("#room").html("")
        data.arrayRooms.forEach(room=>{
            if(room.users.length == 2){
                $("#room").append("<option id="+room.name+" value="+room.name+">"+"<div>" + room.name + "</div>" + "<div> ( Đầy )</div>" + "</option>")
                $('#'+room.name).attr("style", "background-color: coral");
            }
            else{
                $("#room").append("<option id="+room.name+" value="+room.name+">"+"<div>" + room.name + "</div>" + "<div> ( Còn Trống )</div>" + "</option>")
            }
        })
    }
    else {
        alert("Phong Da Ton Tai")
    }
})

socket.on('server-accset-rooms', ()=>{
    window.location.href = "/online/online-rooms?roomName=" + $("#room-name").val();
})

$("#online-join-room").click(()=>{
    console.log($("#room").val());
    socket.emit('client-check-rooms', $("#room").val())
    socket.on('server-check-rooms', data=>{
        if(data == "error"){
            alert("Phong Da Day")
        }
        else{
            window.location.href = "online/online-rooms?roomName=" + $("#room").val();
        }
    })
})

$("#btn-online-creat").click(()=>{
    socket.emit("client-create-rooms", $("#room-name").val());
})