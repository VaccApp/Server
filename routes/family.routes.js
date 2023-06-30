const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Family = require("../models/Family.model");
const User = require("../models/User.model");
const Child = require("../models/Child.model.js");
const familyController = require("../controllers/family.controller");

router.get("/", familyController.list);

router.post("/", familyController.create);

router.get("/:familyId", familyController.detail);

router.put("/:familyId", familyController.edit);

router.delete("/:familyId", familyController.delete);

module.exports = router;