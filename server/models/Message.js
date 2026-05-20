const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({

    user: {
        type: String
    },

    text: {
        type: String
    },

    time: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }

})

module.exports =
    mongoose.model('Message', messageSchema)