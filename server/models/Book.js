const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    thumbnail: {
        type: String
    },

    pdf: {
        type: String,
        required: true
    },

    uploadedBy: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model(

    'Book',

    BookSchema

)