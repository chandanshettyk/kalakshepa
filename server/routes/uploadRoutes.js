const router = require('express').Router()

const multer = require('multer')

/* Storage */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads')

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

/* Upload */

router.post(

    '/',

    upload.single('file'),

    (req, res) => {

        res.json({

            file: req.file.filename

        })

    }

)

module.exports = router