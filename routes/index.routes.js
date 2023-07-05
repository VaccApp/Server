const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// router.use("/family", require("./family.routes"));
// router.use("/auth", require("./auth.routes"));

router.get("/", isAuthenticated, (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
