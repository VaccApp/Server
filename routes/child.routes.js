const mongoose = require("mongoose");
const express = require("express");
const router = require("express").Router();
const Child = require("../models/Child.model");
const Vaccine = require("../models/Vaccine.model");
const Family = require("../models/Family.model");
const axios = require("axios");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { restart } = require("nodemon");

const REALAPI_URL = "http://localhost:4001/api";

router.get("/", isAuthenticated, (req, res, next) => {
  Child.find()
    .then((child) => res.status(200).json(child))
    .catch((err) => res.json(err));
});

router.get("/:childId/sync", async (req, res, next) => {
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
      console.log(data);
      const vaccinesFromApi = data.vaccines.map((e) => ({
        name: e.vaccinename,
        vaccinationAge: e.vaccinationAge,
      }));
      console.log("VACCINES FROM API", vaccinesFromApi);
      const newVaccines = await Vaccine.create(vaccinesFromApi);
      console.log(newVaccines[0]);
      const vaccIds = newVaccines.map((v) => v._id);
      console.log("vaccIds", vaccIds);
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

router.get("/:childId/new", async (req, res, next) => {
  const { childId } = req.params;

  const child = await Child.findById(childId);

  axios
    .get(`${REALAPI_URL}/vaccines`)
    .then(async ({ data }) => {
      console.log(data);
      const allVaccinesFromApi = await data.map((e) => ({
        name: e.vaccineName,
        vaccinationAge: e.vaccinationAge,
      }));
      const allNewVaccines = await Vaccine.create(allVaccinesFromApi);
      console.log(allNewVaccines);
      const vaccIds = await allNewVaccines.map((v) => v._id);
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

router.get("/:childId", (req, res, next) => {
  const { childId } = req.params;
  Child.findById(childId)
    .populate("family")
    .populate({
      path: "family",
      populate: { path: "children" },
    })
    .populate({
      path: "family",
      populate: { path: "parents" },
    })
    .populate("vaccines")
    .then((child) => res.status(200).json(child))
    .catch((err) => res.json(err));
});

//     router.get("/:childId", (req, res, next) => {
//       const { childId } = req.params;
//       Child.findById(childId)
//     .populate("vaccines")
//     .then((child) => res.status(200).json(child))
//     .catch((err) => res.json(err));
// });

router.get("/:childId/calendar", (req, res, next) => {
  const { childId } = req.params;
  axios
    .get(`${REALAPI_URL}/vaccines`)
    .then((response) => {
      console.log(response.data);
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

router.get("/vaccine/:vaccineId", async (req, res, next) => {
  const { vaccineId } = req.params;
  const vaccine = await Vaccine.findById(vaccineId);
  const child = await Child.findOne({ vaccines: vaccineId });
  let resp = [];
  resp.push(child, vaccine);
  console.log(resp);
  return res.status(200).json(resp);
});

router.post("/vaccine/:vaccineId", async (req, res, next) => {
  const { vaccineId } = req.params;
  const { selectedDate } = req.body;
  const vaccine = await Vaccine.findByIdAndUpdate(vaccineId, {
    vaccinationDate: selectedDate,
  });
  console.log(selectedDate, "vaccine", vaccine);
  const child = await Child.findOne({ vaccines: vaccineId });
  let resp = [];
  resp.push(child, vaccine);
  console.log(resp, "WEE", selectedDate);
  return res.status(200).json(resp);
});

router.put("/:childId", (req, res, next) => {
  const { childId } = req.params;
  const { name, birthdate, childPic } = req.body;

  Child.findByIdAndUpdate(childId, { name, birthdate, childPic }, { new: true })
    .then((updatedChild) => res.json(updatedChild))
    .catch((err) => res.json(err));
});

router.delete("/:childId", (req, res, next) => {
  const { childId } = req.params;

  Child.findByIdAndDelete(childId)
    .then(() => res.json({ message: "Hijo eliminado correctamente" }))
    .catch((err) => res.json(err));
});

module.exports = router;
