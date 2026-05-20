const express = require('express')

const mongoose = require('mongoose')

const cors = require('cors')

require('dotenv').config()

/* =========================
   APP
========================= */

const app = express()

const server =
    require('http').createServer(app)

/* =========================
   SOCKET.IO
========================= */

const io = require('socket.io')(server, {

    cors: {
        origin: '*'
    }

})

/* =========================
   ROUTES
========================= */

const authRoutes =
    require('./routes/authRoutes')

const uploadRoutes =
    require('./routes/uploadRoutes')

const userRoutes =
    require('./routes/userRoutes')

/* =========================
   MODELS
========================= */

const Message =
    require('./models/Message')

/* =========================
   MIDDLEWARE
========================= */

app.use(cors())

app.use(express.json())

/* Upload Folder */

app.use(

    '/uploads',

    express.static('uploads')

)

/* =========================
   API ROUTES
========================= */

app.use(

    '/api/auth',

    authRoutes

)

app.use(

    '/api/upload',

    uploadRoutes

)

app.use(

    '/api/user',

    userRoutes

)

/* =========================
   MONGODB
========================= */

mongoose.connect(

    process.env.MONGO_URI

)

.then(() => {

    console.log(

        'MongoDB Connected'

    )

})

.catch((err) => {

    console.log(err)

})

/* =========================
   CHESS ROOMS
========================= */

const chessRooms = {}

/* =========================
   SOCKET CONNECTION
========================= */

io.on(

    'connection',

    async(socket) => {

        console.log(

            'User Connected'

        )

        /* =====================
           LOAD CHAT
        ===================== */

        const oldMessages =

            await Message.find()

        socket.emit(

            'loadMessages',

            oldMessages

        )

        /* =====================
           SEND MESSAGE
        ===================== */

        socket.on(

            'sendMessage',

            async(message) => {

                const newMessage =

                    new Message(message)

                await newMessage.save()

                io.emit(

                    'receiveMessage',

                    newMessage

                )

            }

        )

        /* =====================
           CLEAR CHAT
        ===================== */

        socket.on(

            'clearMessages',

            async() => {

                await Message.deleteMany()

                io.emit(

                    'messagesCleared'

                )

            }

        )

        /* =====================
           CREATE ROOM
        ===================== */

        socket.on(

            'createRoom',

            ({ roomCode, username }) => {

                roomCode =

                    roomCode

                    .trim()

                .toUpperCase()

                /* Empty */

                if (!roomCode) {

                    socket.emit(

                        'errorMessage',

                        'Enter Room Code'

                    )

                    return

                }

                /* Already Exists */

                if (chessRooms[roomCode]) {

                    socket.emit(

                        'errorMessage',

                        'Room Already Exists'

                    )

                    return

                }

                /* Create */

                chessRooms[roomCode] = {

                    white: username,

                    black: null,

                    timer: 300

                }

                socket.join(roomCode)

                console.log(

                    'ROOM CREATED:',

                    roomCode

                )

                console.log(

                    chessRooms

                )

                socket.emit(

                    'roomCreated',

                    {

                        roomCode,

                        color: 'white'

                    }

                )

            }

        )

        /* =====================
           JOIN ROOM
        ===================== */

        socket.on(

            'joinRoom',

            ({ roomCode, username }) => {

                roomCode =

                    roomCode

                    .trim()

                .toUpperCase()

                console.log(

                    'JOIN REQUEST:',

                    roomCode

                )

                console.log(

                    'AVAILABLE ROOMS:',

                    chessRooms

                )

                const room =

                    chessRooms[roomCode]

                /* Not Found */

                if (!room) {

                    socket.emit(

                        'errorMessage',

                        'Room Not Found'

                    )

                    return

                }

                /* Full */

                if (room.black) {

                    socket.emit(

                        'errorMessage',

                        'Room Full'

                    )

                    return

                }

                /* Join */

                room.black = username

                socket.join(roomCode)

                console.log(

                    'PLAYER JOINED:',

                    username

                )

                socket.emit(

                    'joinedRoom',

                    {

                        roomCode,

                        color: 'black'

                    }

                )

                /* START GAME */

                io.to(roomCode).emit(

                    'gameStart',

                    {

                        white: room.white,

                        black: room.black,

                        timer: 300

                    }

                )

                console.log(

                    'GAME STARTED:',

                    roomCode

                )

            }

        )

        /* =====================
           CHESS MOVE
        ===================== */

        socket.on(

            'chessMove',

            ({ roomCode, move }) => {

                socket

                    .to(roomCode)

                .emit(

                    'receiveMove',

                    move

                )

            }

        )

        /* =====================
           NEW GAME
        ===================== */

        socket.on(

            'newGame',

            ({ roomCode }) => {

                io.to(roomCode).emit(

                    'restartGame'

                )

            }

        )

        /* =====================
           DISCONNECT
        ===================== */

        socket.on(

            'disconnect',

            () => {

                console.log(

                    'User Disconnected'

                )

            }

        )

    }

)

/* =========================
   START SERVER
========================= */

server.listen(

    process.env.PORT || 5000,

    () => {

        console.log(

            `Server running on ${process.env.PORT || 5000}`

        )

    }

)

const bookRoutes =
    require('./routes/bookRoutes')

app.use(

    '/api/books',

    bookRoutes

)