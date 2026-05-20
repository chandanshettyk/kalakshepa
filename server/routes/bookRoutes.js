const express = require('express')

const router = express.Router()

const multer = require('multer')

const Book = require('../models/Book')

/* =========================
   STORAGE
========================= */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(

            null,

            'uploads/books'

        )

    },

    filename: (req, file, cb) => {

        cb(

            null,

            Date.now() +

            '-' +

            file.originalname

        )

    }

})

const upload = multer({

    storage

})

/* =========================
   UPLOAD BOOK
========================= */

router.post(

    '/upload',

    upload.fields([

        {

            name: 'thumbnail',

            maxCount: 1

        },

        {

            name: 'pdf',

            maxCount: 1

        }

    ]),

    async(req, res) => {

        try {

            const {

                title,

                author,

                category,

                description,

                uploadedBy

            } = req.body

            const thumbnail =

                req.files['thumbnail']

            ?
            req.files['thumbnail'][0].path

                : ''

            const pdf =

                req.files['pdf'][0].path

            const newBook =

                new Book({

                    title,

                    author,

                    category,

                    description,

                    thumbnail,

                    pdf,

                    uploadedBy

                })

            await newBook.save()

            res.json({

                success: true,

                message: 'Book Uploaded',

                book: newBook

            })

        } catch (err) {

            console.log(err)

            res.status(500).json({

                success: false,

                message: 'Upload Failed'

            })

        }

    }

)

/* =========================
   GET ALL BOOKS
========================= */

router.get(

    '/all',

    async(req, res) => {

        try {

            const books =

                await Book.find()

            .sort({

                createdAt: -1

            })

            res.json(books)

        } catch (err) {

            res.status(500).json({

                message: 'Error'

            })

        }

    }

)

/* =========================
   SEARCH BOOKS
========================= */

router.get(

    '/search/:key',

    async(req, res) => {

        try {

            const key =

                req.params.key

            const books =

                await Book.find({

                    $or: [

                        {

                            title: {

                                $regex: key,

                                $options: 'i'

                            }

                        },

                        {

                            author: {

                                $regex: key,

                                $options: 'i'

                            }

                        },

                        {

                            category: {

                                $regex: key,

                                $options: 'i'

                            }

                        }

                    ]

                })

            res.json(books)

        } catch (err) {

            res.status(500).json({

                message: 'Search Error'

            })

        }

    }

)

/* =========================
   DELETE BOOK
========================= */

router.delete(

    '/delete/:id',

    async(req, res) => {

        try {

            await Book.findByIdAndDelete(

                req.params.id

            )

            res.json({

                success: true,

                message: 'Book Deleted'

            })

        } catch (err) {

            res.status(500).json({

                message: 'Delete Failed'

            })

        }

    }

)

module.exports = router