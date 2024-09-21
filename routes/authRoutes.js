const router = require("express").Router()
const { authCtrl } = require('../controllers')

router.use(authCtrl.getCurrentUserInfo)
router.post('/', authCtrl.registerUser)
router.post('/login', authCtrl.loginUser)
router.post('/logout', authCtrl.logoutUser)
router.put('/:id', authCtrl.updateUser)

module.exports = router