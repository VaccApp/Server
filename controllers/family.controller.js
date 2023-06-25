const Family = require("../models/Family.model");

module.exports.create = async (req, res, next) => {
  try {
    if (!req.body) return res.status(400).json({ message: "Bad request" });
    const family = await Family.create(req.body);
    return res.status(201).json(family);
  } catch (error) {
    next(error);
  }
};
