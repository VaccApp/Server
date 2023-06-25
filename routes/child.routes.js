const router = require("express").Router();
const Child = require("../models/Child.model");
const Family = require("../models/Family.model");

router.post("/child", (req, res, next) => {
  const { name, birthDate, familyId } = req.body;

  Child.create({ name, birthDate, family: familyId })
    .then((newChild) => {
      return Family.findByIdAndUpdate(
        familyId,
        { $push: { children: newChild._id } },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/child/:id", (req, res, next) => {
  const { id } = req.params;

  Child.findById(id)
    .populate("family")
    .then((child) => res.json(child))
    .catch((err) => res.json(err));
});

router.put("/child/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, birthDate } = req.body;

  Child.findByIdAndUpdate(id, { name, birthDate }, { new: true })
    .then((updatedChild) => res.json(updatedChild))
    .catch((err) => res.json(err));
});

router.delete("/child/:id", (req, res, next) => {
  const { id } = req.params;

  Child.findByIdAndDelete(id)
    .then(() => res.json({ message: "Hijo eliminado correctamente" }))
    .catch((err) => res.json(err));
});

module.exports = router;
