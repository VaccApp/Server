const express = require("express");
const router = express.Router();

// router.get("/", (req, res, next) => {
//   res.json("All good in here");
// });

router.use("/family", require("./family.routes"));

module.exports = router;
