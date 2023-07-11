const Family = require("../models/Family.model");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const Child = require("../models/Child.model");

module.exports.list = async (req, res, next) => {
  try {
    const families = await Family.find({
      parents: req.payload._id,
    })
      .populate("children")
      .populate("parents");
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
    return res.status(201).json(family);
  } catch (error) {
    next(error);
  }
};

module.exports.detail = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const family = await Family.findById(familyId)
      .populate("children")
      .populate("parents");
    console.log("family", family);
    return res.status(200).json(family);
  } catch (error) {
    next(error);
  }
};

module.exports.children = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const children = await Child.find({ family: familyId });
    console.log("AQUI", children);
    return res.status(200).json(children);
  } catch (error) {
    next(error);
  }
};

module.exports.addChild = async (req, res, next) => {
  const { familyId } = req.params;
  const { name, birthdate, healthcard } = req.body;

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
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
};

module.exports.edit = async (req, res, next) => {
  const { familyId } = req.params;
  const { surname, parents, children } = req.body;
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Bad request: empty req.body" });
    }
    const familyToEdit = await Family.findByIdAndUpdate(familyId, req.body, {
      new: true,
    })
      .then((updatedFamily) => res.json(updatedFamily))
      .catch((error) => res.json(error));
  } catch (error) {
    next(error);
  }
};

module.exports.invite = async (req, res, next) => {
  const { familyId } = req.params;
  const { email } = req.body;
  try {
    const family = await Family.findById(familyId);
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `"VaccApp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Invitación a unirse a la familia ${family.surname}`,
      html: `<h1>¡Hola!</h1>
      <p>Has sido invitado a unirte a la familia ${family.surname} en VaccApp. Haz click <a href="http://localhost:5005/join-family/${familyId}">aquí</a> para aceptar la invitación.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
    return res.status(200).json("Email enviado correctamente");
  } catch (error) {
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  const { familyId } = req.params;

  try {
    const familyToDelete = await Family.findByIdAndDelete(familyId);
    return res.status(200).json("Familia borrada correctamente");
  } catch (error) {
    next(error);
  }
};
