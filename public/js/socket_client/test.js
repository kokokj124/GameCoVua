var countDown = 5;
times = setInterval(function() {
    countDown.value -= 1;
    minutes = Math.floor(countDown.value / 60);
    seconds = countDown.value - minutes * 60;
    console.log( minutes + ":" + seconds);
    if(countDown.value == 2)
     {clearInterval(times);
      console.log(countDown);}
}, 1000);

console.log(countDown.value);