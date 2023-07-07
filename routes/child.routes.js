const router = require("express").Router();
const Child = require("../models/Child.model");
const Vaccine = require("../models/Vaccine.model");
const Family = require("../models/Family.model");
const axios = require("axios");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const REALAPI_URL = "http://localhost:4001/api";

router.get("/", isAuthenticated, (req, res, next) => {
  Child.find()
    .then((child) => res.json(child))
    .catch((err) => res.json(err));
});

router.post("/", isAuthenticated, (req, res, next) => {
  const { name, birthdate, familyId, healthcard } = req.body;

  Child.create({
    name,
    birthdate,
    healthcard,
    family: familyId,
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
  const queryParams = {
    name: child.name,
    healthcard: child.healthcard,
  };

  axios
    .get(`${REALAPI_URL}/${healthcard}`, {
      params: queryParams,
    })
    .then(async ({ data }) => {
      const vaccinesFromApi = data.vaccines.map((e) => ({
        name: e.vaccineName,
        vaccinationAge: e.vaccinationAge,
      }));
      const newVaccines = await Vaccine.create(vaccinesFromApi);
      console.log(newVaccines);
      const vaccIds = newVaccines.map((v) => v._id);
      const updatedChild = await Child.findByIdAndUpdate(
        childId,
        {
          $push: { vaccines: vaccIds },
        },
        { new: true }
      );

      res.status(200).json(updatedChild);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  Child.findById(id)
    .then((child) => res.status(200).json(child))
    .catch((err) => res.json(err));
});

router.get("/:childId/calendar", (req, res, next) => {
  const { childId } = req.params;
  axios
    .get(`${REALAPI_URL}/vaccines`)
    .then((response) => {
      const vaccines = response.data;
      const vaccinationAge = vaccines.map((vaccine) => vaccine.vaccinationAge);
      const vaccineName = vaccines.map((vaccine) => vaccine.vaccineName);
      const vaccineId = vaccines.map((vaccine) => vaccine._id);

      Child.findById(childId)
        .then((child) => {
          const childAgeInMonths = Math.floor(
            (new Date() - child.birthdate) / 1000 / 60 / 60 / 24 / 30
          );
          console.log("Child age in months", childAgeInMonths);
          const vaccinesToBeTaken = vaccinationAge.map((age, index) => {
            if (age - childAgeInMonths === 1) {
              return {
                vaccineName: vaccineName[index],
                vaccineId: vaccineId[index],
              };
            }
          });
          const vaccinesToBeTakenFiltered = vaccinesToBeTaken.filter(
            (vaccine) => vaccine !== undefined
          );
          res.status(200).json(vaccinesToBeTakenFiltered);
          console.log("vaccinesToBeTakenFiltered", vaccinesToBeTakenFiltered);
          console.log(
            "Total number of vaccines in this month",
            vaccinesToBeTakenFiltered.length
          );
          // window.alert(`Tienes ${vaccinesToBeTakenFiltered.length} vacunas pendientes durante el próximo mes.`);
        })
        .catch((err) => res.json(err));
    })
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
