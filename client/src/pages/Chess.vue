<template>

<div class="page">

  <div class="container">

    <h1>
      ♟ Multiplayer Chess
    </h1>

    <!-- Join/Create -->

    <div
      v-if="!gameStarted"
      class="join-box"
    >

      <input

        type="text"

        placeholder="Enter Room Code"

        v-model="roomCode"

      />

      <button @click="createRoom">

        Create Room

      </button>

      <button @click="joinRoom">

        Join Room

      </button>

    </div>

    <!-- Waiting -->

    <div
      v-if="waiting"
      class="waiting"
    >

      Waiting for second player...

    </div>

    <!-- Game -->

    <div v-if="gameStarted">

      <h2>

        Room:
        {{ currentRoom }}

      </h2>

      <h3>

        You are:
        {{ playerColor }}

      </h3>

      <h2>

        ⏱ {{ timer }}

      </h2>

      <div id="board"></div>

    </div>

  </div>

</div>

</template>

<script setup>

import {

  ref,

  nextTick,

  onMounted

} from 'vue'

/* jQuery */

import $ from 'jquery'

window.$ = $
window.jQuery = $

/* Chessboard */

import Chessboard from 'chessboardjs'

import

'chessboardjs/www/css/chessboard.css'

/* Chess */

import {

  Chess

} from 'chess.js'

/* Socket */

import {

  io

} from 'socket.io-client'

const socket = io(

  'http://localhost:5000'

)

/* User */

const savedUser =

JSON.parse(

  localStorage.getItem('user')

)

const username =

savedUser?.username || 'Guest'

/* Game */

const game = new Chess()

let board = null

/* State */

const roomCode = ref('')

const currentRoom = ref('')

const playerColor = ref('')

const waiting = ref(false)

const gameStarted = ref(false)

const timer = ref(300)

let timerInterval = null

/* =====================
   TIMER
===================== */

const startTimer = ()=>{

  clearInterval(timerInterval)

  timerInterval = setInterval(()=>{

    if(timer.value > 0){

      timer.value--

    }

    else{

      alert('Time Over')

      clearInterval(timerInterval)

    }

  },1000)

}

/* =====================
   FORMAT TIME
===================== */

const formatTimer = ()=>{

  const min =

  Math.floor(timer.value/60)

  const sec =

  timer.value%60

  return

  `${min}:${sec

    .toString()

    .padStart(2,'0')}`

}

/* =====================
   INIT BOARD
===================== */

const initBoard = async()=>{

  await nextTick()

  board = Chessboard(

    'board',

    {

      draggable:true,

      position:'start',

      pieceTheme:

      'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',

      onDragStart,

      onDrop

    }

  )

}

/* =====================
   CREATE ROOM
===================== */

const createRoom = ()=>{

  if(!roomCode.value){

    alert('Enter Room Code')

    return

  }

  socket.emit(

    'createRoom',

    {

      roomCode:

      roomCode.value,

      username

    }

  )

}

/* =====================
   JOIN ROOM
===================== */

const joinRoom = ()=>{

  if(!roomCode.value){

    alert('Enter Room Code')

    return

  }

  socket.emit(

    'joinRoom',

    {

      roomCode:

      roomCode.value,

      username

    }

  )

}

/* =====================
   DRAG START
===================== */

const onDragStart = (

  source,

  piece

)=>{

  /* White */

  if(

    playerColor.value==='white'

  ){

    if(piece.search(/^b/) !== -1){

      return false

    }

  }

  /* Black */

  if(

    playerColor.value==='black'

  ){

    if(piece.search(/^w/) !== -1){

      return false

    }

  }

  /* Turn */

  if(

    game.turn()==='w' &&

    playerColor.value!=='white'

  ){

    return false

  }

  if(

    game.turn()==='b' &&

    playerColor.value!=='black'

  ){

    return false

  }

}

/* =====================
   DROP
===================== */

const onDrop = (

  source,

  target

)=>{

  const move = game.move({

    from:source,

    to:target,

    promotion:'q'

  })

  /* Invalid */

  if(move===null){

    return 'snapback'

  }

  board.position(

    game.fen()

  )

  socket.emit(

    'chessMove',

    {

      roomCode:

      currentRoom.value,

      move

    }

  )

  /* Checkmate */

  if(game.isCheckmate()){

    alert(

      'Checkmate!'

    )

    socket.emit(

      'newGame',

      {

        roomCode:

        currentRoom.value

      }

    )

  }

}

/* =====================
   SOCKETS
===================== */

onMounted(()=>{

  /* Room Created */

  socket.on(

    'roomCreated',

    (data)=>{

      currentRoom.value =

      data.roomCode

      playerColor.value =

      data.color

      waiting.value = true

    }

  )

  /* Joined */

  socket.on(

    'joinedRoom',

    (data)=>{

      currentRoom.value =

      data.roomCode

      playerColor.value =

      data.color

    }

  )

  /* START GAME */

  socket.on(

    'gameStart',

    async()=>{

      waiting.value = false

      gameStarted.value = true

      timer.value = 300

      await initBoard()

      startTimer()

    }

  )

  /* Receive Move */

  socket.on(

    'receiveMove',

    (move)=>{

      game.move(move)

      board.position(

        game.fen()

      )

    }

  )

  /* Restart */

  socket.on(

    'restartGame',

    ()=>{

      game.reset()

      board.start()

      timer.value = 300

      startTimer()

    }

  )

  /* Error */

  socket.on(

    'errorMessage',

    (msg)=>{

      alert(msg)

    }

  )

})

</script>

<style scoped>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial;
}

.page{

  min-height:100vh;

  display:flex;

  justify-content:center;

  align-items:center;

  background:

  linear-gradient(
    135deg,
    #071029,
    #000
  );
}

.container{

  width:100%;

  max-width:850px;

  padding:35px;

  border-radius:30px;

  background:

  rgba(255,255,255,0.05);

  backdrop-filter:blur(20px);

  border:

  1px solid rgba(255,255,255,0.08);

  text-align:center;

  color:white;
}

h1{

  color:#22c55e;

  font-size:42px;

  margin-bottom:30px;
}

.join-box{

  display:flex;

  gap:12px;

  justify-content:center;

  flex-wrap:wrap;
}

.join-box input{

  width:240px;

  height:55px;

  border:none;

  outline:none;

  border-radius:14px;

  padding:0 15px;

  font-size:16px;
}

.join-box button{

  height:55px;

  padding:0 20px;

  border:none;

  border-radius:14px;

  background:#22c55e;

  font-size:16px;

  font-weight:bold;

  cursor:pointer;
}

.waiting{

  color:#22c55e;

  font-size:24px;
}

#board{

  width:520px;

  margin:35px auto;
}

</style>