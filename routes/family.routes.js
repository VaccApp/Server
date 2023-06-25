const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Family = require("../models/Family.model");
const User = require("../models/User.model");
const Child = require("../models/Child.model.js");
const familyController = require("../controllers/family.controller");

router.get("/", (req, res, next) => {
  res.json("Here's your family");
});

// router.post("/", async (req, res, next) => {
//   const { surname, parents, children } = req.body;
//   try {
//     if (!req.body) {
//       return res.status(400).json({
//         message: "Debes rellenar todos los campos para crear una familia",
//       });
//     }

//     const familyCreation = await Family.create({
//       surname,
//       parents: ["papa", "mama"],
//       children: ["hijo", "hija"],
//     });
//     res.status(201).json("Creating family", familyCreation);
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/", async (req, res, next) => {
//   const { surname } = req.body;
//   const newFamily = await Family.create({
//     surname,
//     parents: ["payo"],
//     children: [],
//   })
//     .then((response) => res.json(response, newFamily))
//     .catch((err) => res.json(err));
// });

router.post("/", familyController.create);

module.exports = router;
