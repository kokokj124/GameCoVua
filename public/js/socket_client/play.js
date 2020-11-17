var board = null
var $board = $('#board')
var game = new Chess()
var squareToHighlight = null
var squareClass = 'square-55d63'

// var socket = io("https://vu-nam.herokuapp.com/online/online-rooms")
var socket = io.connect("127.0.0.1:3000/online/online-rooms", {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 15000,
  reconnectionAttempts: 2
})

socket.on("reconnect_failed", () => {
  alert("reconnect_failed")
  window.location.href = "/online/online-rooms";
})

socket.on("reconnecting", () => {
  alert("reconnecting...")
})

socket.on("reconnect", () => {
  alert("reconnect active...")
})

socket.on("server-sent-player-transport-error", () => {
  alert("người chơi bên kia mất kết nối")
});

function removeHighlights(color) {
  $board.find('.' + squareClass)
    .removeClass('highlight-' + color)
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) {
    // alert("Mau " + orientation + " win")
    return false
  }

  // only pick up pieces for the side to move
  if ((orientation === 'white' && piece.search(/^w/) === -1) ||
    (orientation === 'black' && piece.search(/^b/) === -1)) {
    return false
  }
}

var onMouseoverSquare = function (square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};
var countDown = { valueBlack: 600, valueWhite: 600 };
var minutes, seconds
var times
socket.on("server-send-data", data => {
  var move = game.move({
    from: data.move.from,
    to: data.move.to,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })
  clearInterval(times);
  console.log(data.countDown);
  countDown = data.countDown;
  console.log(countDown);
  if (data.move.color == 'w') {
    $("#colorGo").html("<b style='color: white'> Mau " + "Black" + " di </b>");
    timeOut(data.countDown, "timeBlack")
  }
  else {
    $("#colorGo").html("<b style='color: white'> Mau " + "White" + " di </b>");
    timeOut(data.countDown, "timeWhite")
  }
  if (move === null) return 'snapback'
  if (move.color === 'w') {
    removeHighlights('white')
    $board.find('.square-' + data.move.from).addClass('highlight-white')
    $board.find('.square-' + data.move.to).addClass('highlight-white')
    if (game.in_checkmate()) {
      status = 'Game over, White is in checkmate.'
    }
  } else {
    removeHighlights('black')
    $board.find('.square-' + data.move.from).addClass('highlight-black')
    $board.find('.square-' + data.move.to).addClass('highlight-black')
    if (game.in_checkmate()) {
      status = 'Game over, Black is in checkmate.'
    }
  }
  onSnapEnd();
})
function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
  if (move.color === 'w') {
    removeHighlights('white')
    $board.find('.square-' + source).addClass('highlight-white')
    $board.find('.square-' + target).addClass('highlight-white')
    if (game.in_checkmate()) {
      status = 'Game over, White is in checkmate.'
    }
  } else {
    removeHighlights('black')
    $board.find('.square-' + source).addClass('highlight-black')
    $board.find('.square-' + target).addClass('highlight-black')
    if (game.in_checkmate()) {
      status = 'Game over, Black is in checkmate.'
    }
  }
  socket.emit("client-send-data", { move: move, countDown: countDown });
}

function onMoveEnd() {
  $board.find('.square-' + squareToHighlight)
    .addClass('highlight-black')
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

var onMouseoutSquare = function (square, piece) {
  removeGreySquares();
};

var removeGreySquares = function () {
  $('#board .square-55d63').css('background', '');
};

var onMouseoverSquare = function (square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var greySquare = function (square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var config = {
  draggable: true,
  position: 'start',
  orientation: 'black',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
}
board = ChessBoard('board', config)

socket.on("server-reset-player", () => {
  board.orientation('black')
  $("#colorGo").html("<b style='color: white'> Mau " + "White" + " di </b>");
  clearInterval(times);
  document.getElementById("timeWhite").innerHTML = "";
  document.getElementById("timeBlack").innerHTML = "";
  game.reset()
  board.start()
})

socket.on("server-send-color", data => {
  console.log(data);
  if (data == 'w') {
    board.orientation('white')
  }
  else {
    board.orientation('black')
  }
})

function timeOut(countDown, color) {
  times = setInterval(function () {
    if (color == "timeWhite") {
      countDown.valueWhite -= 1;
      minutes = Math.floor(countDown.valueWhite / 60);
      seconds = countDown.valueWhite - minutes * 60;
      document.getElementById("timeWhite").innerHTML = minutes + ":" + seconds;
    }
    else {
      countDown.valueBlack -= 1;
      minutes = Math.floor(countDown.valueBlack / 60);
      seconds = countDown.valueBlack - minutes * 60;
      document.getElementById("timeBlack").innerHTML = minutes + ":" + seconds;
    }
    if (countDown.valueWhite == 0 || countDown.valueBlack == 0) {
      clearInterval(times);
      if (countDown.valueWhite == 0) alert('Game over, Black is in checkmate.')
      else alert('Game over, White is in checkmate.')
    }
  }, 1000);
} 