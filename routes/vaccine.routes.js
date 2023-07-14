const router = require("express").Router();
const Vaccine = require("../models/Vaccine.model");
const Child = require("../models/Child.model");
const axios = require("axios");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const REALAPI_URL = "http://localhost:4001/api";

router.get("/", (req, res, next) => {
  Vaccine.find()
    .then((vaccines) => res.json(vaccines))
    .catch((err) => res.json(err));
});

router.get("/calendar", (req, res, next) => {
  axios
    .get(`${REALAPI_URL}/vaccines`)
    .then((response) => res.status(200).json(response.data))
    .catch((err) => res.json(err));
});

router.post("/:receiverId", (req, res, next) => {
  const {
    name,
    dose,
    disease,
    creator,
    expires,
    batch,
    status,
    vaccinationAge,
    vaccinationDate,
  } = req.body;

  const { receiverId } = req.params;

  Vaccine.create({
    name,
    dose,
    disease,
    creator,
    expires,
    batch,
    status,
    vaccinationAge,
    vaccinationDate,
  })
    .then((newVaccine) => {
      return Child.findByIdAndUpdate(
        receiverId,
        { $push: { vaccines: newVaccine } },
        { new: true }
      );
    })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.json(err));
});

router.get("/:vaccineId", (req, res, next) => {
  const { vaccineId } = req.params;

  Vaccine.findById(vaccineId)
    .then((vaccine) => console.log(vaccine))
    .catch((err) => res.json(err));
});

router.put("/:vaccineId", (req, res, next) => {
  const { vaccineId } = req.params;
  const {
    name,
    dose,
    disease,
    creator,
    expires,
    batch,
    status,
    vaccinationAge,
    vaccinationDate,
  } = req.body;

  Vaccine.findByIdAndUpdate(
    vaccineId,
    {
      name,
      dose,
      disease,
      creator,
      expires,
      batch,
      status,
      vaccinationAge,
      vaccinationDate,
    },
    { new: true }
  )
    .then((updatedVaccine) => res.status(200).json(updatedVaccine))
    .catch((err) => res.status(500).json(err));
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Vaccine.findByIdAndDelete(id)
    .then(() => res.json({ message: "Vacuna eliminada correctamente" }))
    .catch((err) => res.json(err));
});

module.exports = router;
