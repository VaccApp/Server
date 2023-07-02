const Family = require("../models/Family.model");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");

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
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `"VaccApp" <${process.env.GMAIL_USER}>`,
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
