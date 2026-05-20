const router = require('express').Router()

const User = require('../models/User')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

/* =========================
   REGISTER
========================= */

router.post('/register', async(req, res) => {

    try {

        const { username, email, password } = req.body

        /* Check Username */

        const existingUsername =
            await User.findOne({

                username

            })

        if (existingUsername) {

            return res.status(400).json({

                message: 'Username already taken'

            })

        }

        /* Check Email */

        const existingEmail =
            await User.findOne({

                email

            })

        if (existingEmail) {

            return res.status(400).json({

                message: 'Email already registered'

            })

        }

        /* Hash Password */

        const hashedPassword =
            await bcrypt.hash(password, 10)

        /* Create User */

        const newUser = new User({

            username,
            email,
            password: hashedPassword

        })

        await newUser.save()

        res.json({

            message: 'User Registered Successfully'

        })

    } catch (error) {

        res.status(500).json({

            message: 'Server Error'

        })

    }

})

/* =========================
   LOGIN
========================= */

router.post('/login', async(req, res) => {

    try {

        const { email, password } = req.body

        /* Find User */

        const user =
            await User.findOne({ email })

        if (!user) {

            return res.status(400).json({

                message: 'User not found'

            })

        }

        /* Check Password */

        const validPassword =
            await bcrypt.compare(

                password,
                user.password

            )

        if (!validPassword) {

            return res.status(400).json({

                message: 'Wrong password'

            })

        }

        /* JWT Token */

        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '7d'
            }

        )

        /* Response */

        res.json({

            token,

            user: {
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }

        })

    } catch (error) {

        res.status(500).json({

            message: 'Server Error'

        })

    }

})

module.exports = router

router.get('/users', async(req, res) => {

    try {

        const users =
            await User.find()

        res.json(users)

    } catch (error) {

        res.status(500).json({

            message: 'Server Error'

        })

    }

})

module.exports = router