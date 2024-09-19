const router = require("express").Router()
const { authCtrl } = require('../controllers')

router.post('/', authCtrl.registerUser)
router.post('/login', authCtrl.loginUser)
router.post('/logout', authCtrl.logoutUser)

module.exports = router