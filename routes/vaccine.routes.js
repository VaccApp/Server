const router = require("express").Router();
const Vaccine = require("../models/Vaccine.model");
const Child = require("../models/Child.model");

router.get("/", (req, res, next) => {
  Vaccine.find()
    .then((vaccines) => res.json(vaccines))
    .catch((err) => res.json(err));
});

router.post("/:receiverId", (req, res, next) => {
  const { name, dose, disease, creator, expires, batch, status } = req.body;

  const { receiverId } = req.params;

  Vaccine.create({
    name,
    dose,
    disease,
    creator,
    expires,
    batch,
    status,
  })
    .then((newVaccine) => {
      return Child.findByIdAndUpdate(
        receiverId,
        { $push: { vaccines: newVaccine } },
        { new: true }
      );
    })
    .then((response) => {
      console.log(response);

      res.json(response);
    })
    .catch((err) => res.json(err));
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Vaccine.findById(id)
    .then((vaccine) => res.status(200).json(vaccine))
    .catch((err) => res.json(err));
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, dose, disease, creator, expires, batch } = req.body;

  Vaccine.findByIdAndUpdate(
    id,
    { name, dose, disease, creator, expires, batch },
    { new: true }
  )
    .then((updatedVaccine) => res.json(updatedVaccine))
    .catch((err) => res.json(err));
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Vaccine.findByIdAndDelete(id)
    .then(() => res.json({ message: "Vacuna eliminada correctamente" }))
    .catch((err) => res.json(err));
});

module.exports = router;
