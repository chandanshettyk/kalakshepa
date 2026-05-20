const router = require('express').Router()

const User = require('../models/User')

/* Update Avatar */

router.put(

    '/avatar/:id',

    async(req, res) => {

        try {

            const updatedUser =

                await User.findByIdAndUpdate(

                    req.params.id,

                    {

                        avatar: req.body.avatar

                    },

                    {

                        new: true

                    }

                )

            res.json(updatedUser)

        } catch (error) {

            res.status(500).json(error)

        }

    }

)

module.exports = router