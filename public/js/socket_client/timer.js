var countDown = 600;
var minutes, seconds
// Update the count down every 1 second
setInterval = (function() {
  countDown = countDown - 1;
  minutes = Math.floor(countDown / 60);
  seconds = countDown - minutes * 60;
  document.getElementById("demo").innerHTML = minutes + ":" + seconds;
  console.log(tempTime);
  if (countDown == 0) {
    clearInterval(setInterval);
    window.location.replace('./CoVua/app2player.html');
  }
}, 1000);