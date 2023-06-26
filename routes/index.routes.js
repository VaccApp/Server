const express = require("express");
const router = express.Router();

// router.use("/family", require("./family.routes"));
// router.use("/auth", require("./auth.routes"));

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
