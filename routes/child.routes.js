const router = require("express").Router();
const Child = require("../models/Child.model");
const Family = require("../models/Family.model");
const axios = require("axios");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// const regularVaccines = require("../db/vaccines.json");

const REALAPI_URL = "http://localhost:4001/api";

router.get("/", isAuthenticated, (req, res, next) => {
  Child.find()
    .then((child) => res.json(child))
    .catch((err) => res.json(err));
});

router.post("/", isAuthenticated, (req, res, next) => {
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

router.get("/:childId/sync", isAuthenticated, async (req, res, next) => {
  const { childId } = req.params;

  const child = await Child.findById(childId);

  const healthcard = child.healthcard;
  // console.log("LN 53 childroutes", healthcard);
  const queryParams = {
    name: child.name,
    healthcard: child.healthcard,
  };

  axios
    .get(`${REALAPI_URL}/${healthcard}`, {
      params: queryParams,
    })
    .then((response) => {
      // console.log("RESPONSE", response.data);
      let childVaccines = child.vaccines;
      const apiVaccines = response.data[0].vaccines;
      // console.log("childVaccines: ", childVaccines);
      // console.log("apiVaccines: ", apiVaccines);

      if (childVaccines.length === 0) {
        childVaccines = [...apiVaccines];
      }
      // console.log("SI?: ", childVaccines);
      const updatedChild = Child.findByIdAndUpdate(childId, {
        $push: { vaccines: childVaccines },
      });
      console.log("childId: ", childId, "Update: ", updatedChild._update);
    })
    .catch((err) => console.log(err));
});

router.get("/:id", isAuthenticated, (req, res, next) => {
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

router.delete("/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;

  Child.findByIdAndDelete(id)
    .then(() => res.json({ message: "Hijo eliminado correctamente" }))
    .catch((err) => res.json(err));
});

module.exports = router;
// childVaccines.push({
//   vaccinename: apiVaccines[i].vaccinename,
//   description: apiVaccines[i].description,
//   vaccinationage: apiVaccines[i].vaccinationage,
// });

// for (let i = 0; i < response.data[0].vaccines.length; i++) {
//   console.log("response", response.data[0].vaccines[i]);
//   child.vaccines.push(response.data[0].vaccines[i]);
// }

// console.log("ChildWithVaccines?", child);
// console.log("response", response.data[0].vaccines[i]);
// res.status(200).json(response.data)
