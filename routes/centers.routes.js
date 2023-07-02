const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const CENTERAPI_URL =
  "https://datos.madrid.es/egob/catalogo/201544-0-centros-salud.json";

router.get("/centers", (req, res, next) => {
  axios
    .get(`${CENTERAPI_URL}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => console.log(error));
});

module.exports = router;
