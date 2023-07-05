const router = require("express").Router();
const Child = require("../models/Child.model");
const Family = require("../models/Family.model");
const axios = require("axios");

// const regularVaccines = require("../db/vaccines.json");

const REALAPI_URL = "http://localhost:4001/api";

router.get("/", (req, res, next) => {
  Child.find()
    .then((child) => res.json(child))
    .catch((err) => res.json(err));
});

router.post("/", (req, res, next) => {
  const { name, birthdate, familyId, healthcard } = req.body;

  // const findData = Citizen.find({ healthcard: healthcard }).then(
  //   (foundCitizen) => {
  //     console.log(foundCitizen);
  //   }
  // );

  // const vaccines = {};

  Child.create({
    name,
    birthdate,
    healthcard,
    family: familyId,
    // vaccines: regularVaccines,
  })
    .then((newChild) => {
      console.log(newChild);
      return Family.findByIdAndUpdate(
        familyId,
        {
          $push: { children: newChild },
        },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/:childId/sync", async (req, res, next) => {
  const { childId } = req.params;

  const foundChild = await Child.findById(childId);

  console.log("LN 53 childroutes", foundChild);
  // const queryParams = {
  //   name: foundChild.name,
  //   healthcard: foundChild.healthcard,
  // };

  const apiCall = await axios
    .get(`${REALAPI_URL}/:healthcard`)
    // , {
    //   params: queryParams,
    // })
    .then((response) => {
      console.log("RESPOOOONSE:", response);
      // res.status(200).json(response.data);
    })
    .catch((error) => console.log(error));
  // .get(`${REALAPI_URL}/citizen/${childId}`)
  // .then((response) => res.status(200).json(response.data))
  // .catch((error) => console.log(error));
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
