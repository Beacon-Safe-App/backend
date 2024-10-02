const router = require("express").Router();
const authRoutes = require("./authRoutes.js");
const locationsRoutes = require("./locationsRoutes.js");

router.use("/auth", authRoutes);
router.use("/locations", locationsRoutes);

module.exports = router;
