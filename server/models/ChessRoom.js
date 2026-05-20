const mongoose = require('mongoose')

const ChessRoomSchema = new mongoose.Schema({

    roomCode: String,

    players: [String],

    fen: String,

    turn: String

})

module.exports = mongoose.model(

    'ChessRoom',

    ChessRoomSchema

)