const Family = require("../models/Family.model");

module.exports.list = async (req, res, next) => {
  try {
    // console.log("Anna ID", req.payload);
    const families = await Family.find()
      .populate("children")
      .populate("parents");
    if (families.length === 0) {
      return res.status(204).json({ message: "There are no families here!" });
    }
    return res.status(200).json(families);
  } catch (error) {
    next(error);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "Bad request: empty req.body" });

    const family = await Family.create(req.body);
    console.log("FamilyController line 24", req.body);
    // const parentIns = await req.body.parents.push()
    // console.log("family controller line 23", req.body, "user:");
    return res.status(201).json(family);
  } catch (error) {
    next(error);
  }
};

module.exports.detail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const family = await Family.findById(id)
      .populate("children")
      .populate("parents");
    console.log("family", family);
    return res.status(200).json(family);
  } catch (error) {
    next(error);
  }
};

module.exports.edit = async (req, res, next) => {
  const { id } = req.params;
  const { surname, parents, children } = req.body;
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Bad request: empty req.body" });
    }
    const familyToEdit = await Family.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .then((updatedFamily) => res.json(updatedFamily))
      .catch((error) => res.json(error));
  } catch (error) {
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  const { id } = req.params;

  try {
    const familyToDelete = await Family.findByIdAndDelete(id);
    return res.status(200).json("Familia borrada correctamente");
  } catch (error) {
    next(error);
  }
};
