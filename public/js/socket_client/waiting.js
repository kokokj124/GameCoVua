var socket = io("127.0.0.1:3000/wating")
  
  socket.on("server-direction", data => {
    window.location.href = "online/online-rooms?roomName=" + data;
  })

  var countDown = 0;
  var minutes, seconds
  // Update the count down every 1 second
  var x = setInterval(function () {
    countDown = countDown + 1;
    minutes = Math.floor(countDown / 60);
    seconds = countDown - minutes * 60;
    document.getElementById("demo").innerHTML = minutes + ":" + seconds;
    if (countDown == 40) {
      clearInterval(x);
      window.location.href = '../offline';
    }
  }, 1000);