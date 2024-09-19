const router = require("express").Router()
const authRoute = require("./authRoutes.js")

router.use('/auth', authRoute)

module.exports = router