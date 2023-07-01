const router = require("express").Router();
const Child = require("../models/Child.model");
const Family = require("../models/Family.model");

router.get("/", (req, res, next) => {
  Child.find()
    .then((child) => res.json(child))
    .catch((err) => res.json(err));
});

router.post("/", (req, res, next) => {
  const { name, birthdate, familyId } = req.body;
  const vaccine1 = {
    name: "vacuna",
    dose: 66,
    disease: "celiaquía",
    creator: "celiaco",
    expires: "2023-12-31T18:25:43.511Z",
    batch: "1234abcd",
    status: "PUESTA",
  };
  const vaccine2 = {
    name: "vacuna2",
    dose: 66,
    disease: "celiaquía",
    creator: "celiaco",
    expires: "2023-12-31T18:25:43.511Z",
    batch: "1234abcd",
    status: "PUESTA",
  };
  const vaccine3 = {
    name: "vacuna3",
    dose: 66,
    disease: "celiaquía",
    creator: "celiaco",
    expires: "2023-12-31T18:25:43.511Z",
    batch: "1234abcd",
    status: "PUESTA",
  };

  Child.create({
    name,
    birthdate,
    family: familyId,
    vaccines: [vaccine1, vaccine2, vaccine3],
  })
    .then((newChild) => {
      // console.log(newChild);
      return Family.findByIdAndUpdate(
        familyId,
        {
          $push: { children: newChild, vaccines: vaccine1, vaccine2, vaccine3 },
        },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Child.findById(id)
    .then((child) => res.status(200).json(child))
    .catch((err) => res.json(err));
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, birthdate } = req.body;

  Child.findByIdAndUpdate(id, { name, birthdate }, { new: true })
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
