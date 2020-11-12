var board = null
var $board = $('#board')
var game = new Chess()
var squareToHighlight = null
var squareClass = 'square-55d63'

// var socket = io("https://vu-nam.herokuapp.com/online/online-rooms")
var socket = io("127.0.0.1:3000/online/online-rooms")

function removeHighlights(color) {
  $board.find('.' + squareClass)
    .removeClass('highlight-' + color)
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()){
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

socket.on("server-send-data", data=>{
  var move = game.move({
    from: data.from,
    to: data.to,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // console.log("aa = " + data.from);

  // illegal move
  if (move === null) return 'snapback'
  if (move.color === 'w') {
    removeHighlights('white')
    $board.find('.square-' + data.from).addClass('highlight-white')
    $board.find('.square-' + data.to).addClass('highlight-white')
    if (game.in_checkmate()) {
      status = 'Game over, White is in checkmate.'
    }
  } else {
    removeHighlights('black')
    $board.find('.square-' + data.from).addClass('highlight-black')
    $board.find('.square-' + data.to).addClass('highlight-black')
    if (game.in_checkmate()) {
      status = 'Game over, Black is in checkmate.'
    }
  }
  onSnapEnd();
})

socket.on("server-send-colorGo",data=>{
  console.log(data);
  $("#colorGo").html("<b> Mau " + data +" di </b>");
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

  socket.emit("client-send-data",move);
  
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

////

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
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
}
board = ChessBoard('board', config)
var color

socket.on("server-reset-player", ()=>{
  board.orientation('black')
  game.reset()
  board.start()
})

socket.on("server-send-color",data=>{
  if(data == 'b'){
    board.flip()
    color = 'b'
  }
  else{
    board.flip()
    color = 'w'
  }
})