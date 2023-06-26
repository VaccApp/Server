const router = require("express").Router();
const Child = require("../models/Child.model");
const Family = require("../models/Family.model");

router.post("/", (req, res, next) => {
  const { name, birthDate, familyId } = req.body;

  Child.create({ name, birthDate, family: familyId })
    .then((newChild) => {
      console.log(familyId);
      return Family.findByIdAndUpdate(
        familyId,
        { $push: { children: newChild } },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Child.findById(id)
    .populate({
      path: "family",
      populate: { path: "parents", path: "children" },
    })
    .then((child) => res.json(child))
    .catch((err) => res.json(err));
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, birthDate } = req.body;

  Child.findByIdAndUpdate(id, { name, birthDate }, { new: true })
    .then((updatedChild) => res.json(updatedChild))
    .catch((err) => res.json(err));
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Child.findByIdAndDelete(id)
    .then(() => res.json({ message: "Hijo eliminado correctamente" }))
    .catch((err) => res.json(err));
});

module.exports = router;
