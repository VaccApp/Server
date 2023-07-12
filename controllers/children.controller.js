const Family = require("../models/Family.model");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const Child = require("../models/Child.model");

module.exports.list = async (req, res, next) => {
  try {
    const children = await Child.find({
      family: req.payload.family,
    })
      .populate("children")
      .populate("parents");
    return res.status(200).json(children);
  } catch (error) {
    next(error);
  }
};

module.exports.detail = async (req, res, enxt) => {
  const { childId } = req.params;
  try {
    const child = await Child.findById(childId)
      .populate("family")
      .populate("vaccines");
    console.log("child from controller", child);
    return res.status(200).json(child);
  } catch (error) {
    next(error);
  }
};
