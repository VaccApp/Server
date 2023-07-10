const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.get("/", isAuthenticated, (req, res, next) => {
  res.json("All good in here");
});

const familyRoutes = require("./family.routes");
router.use("/family", familyRoutes);

const childRoutes = require("./child.routes");
router.use("/child", isAuthenticated, childRoutes);

const vaccineRoutes = require("./vaccine.routes");
router.use("/vaccines", isAuthenticated, vaccineRoutes);

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const centersRoutes = require("./centers.routes");
router.use("/centers", isAuthenticated, centersRoutes);

module.exports = router;
