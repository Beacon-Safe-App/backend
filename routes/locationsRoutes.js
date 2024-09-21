const router = require("express").Router()
const { locationsCtrl } = require('../controllers')
const { authCtrl } = require('../controllers')

router.use(authCtrl.getCurrentUserInfo)
router.post('/', locationsCtrl.createLocation)
router.get('/', locationsCtrl.getLocations)
router.put('/:id', locationsCtrl.updateLocation)
router.delete('/:id', locationsCtrl.deleteLocation)

module.exports = router