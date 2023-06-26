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

router.get("/:id", familyController.detail);

router.put("/:id", familyController.edit);

module.exports = router;
