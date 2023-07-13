const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

const Family = require("../models/Family.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const router = express.Router();

const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { email, password, name, surname, dni } = req.body;

  if (
    email === "" ||
    password === "" ||
    name === "" ||
    surname === "" ||
    dni === ""
  ) {
    res.status(400).json({ message: "Debes rellenar todos los campos." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Proporciona un email válido." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    console.log("TEST", passwordRegex.test(password));
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!dniRegex.test(dni)) {
    res.status(400).json({
      message: "Proporciona un DNI válido: 8 números y una letra mayúscula.",
    });
    return;
  }

  function dniLetter(dni) {
    const dniOnlyNumbers = dni.slice(0, 8);
    const lockup = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letter = lockup.charAt(dniOnlyNumbers % 23);
    return letter;
  }

  if (dniLetter(dni) !== dni.charAt(8)) {
    res.status(400).json({ message: "Proporciona un DNI válido." });
    return;
  } else {
    console.log("DNI VALIDO");
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({
        email,
        password: hashedPassword,
        name,
        surname,
        dni,
        family: [],
      });
    })
    .then((createdUser) => {
      const { surname, _id } = createdUser;
      return Family.create({ surname, parents: [_id], children: [] }).then(
        (createdFamily) => {
          return User.findByIdAndUpdate(
            _id,
            { $push: { family: createdFamily._id } },
            { new: true }
          );
        }
      );
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;

      const user = { email, name, _id };

      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/join-family/:familyId", (req, res, next) => {
  const { familyId } = req.params;
  const { email, password, name, surname, dni } = req.body;

  if (
    email === "" ||
    password === "" ||
    name === "" ||
    surname === "" ||
    dni === ""
  ) {
    res.status(400).json({ message: "Debes rellenar todos los campos." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Proporciona un email válido." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    console.log("TEST", passwordRegex.test(password));
    res.status(400).json({
      message:
        "La contraseña debe tener al menos 6 caracteres y contener al menos un número, una letra minúscula y una mayúscula.",
    });
    return;
  }

  const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!dniRegex.test(dni)) {
    res.status(400).json({
      message: "Proporciona un DNI válido: 8 números y una letra mayúscula.",
    });
    return;
  }

  function dniLetter(dni) {
    const dniOnlyNumbers = dni.slice(0, 8);
    const lockup = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letter = lockup.charAt(dniOnlyNumbers % 23);
    return letter;
  }

  if (dniLetter(dni) !== dni.charAt(8)) {
    res.status(400).json({ message: "Proporciona un DNI válido." });
    return;
  } else {
    console.log("DNI VALIDO");
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "El usuario ya existe." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({
        email,
        password: hashedPassword,
        name,
        surname,
        dni,
        family: [],
      });
    })
    .then((createdUser) => {
      const { _id } = createdUser;
      return Family.findByIdAndUpdate(
        familyId,
        { $push: { parents: _id } },
        { new: true }
      ).then((updatedFamily) => {
        return User.findByIdAndUpdate(
          _id,
          { $push: { family: updatedFamily._id } },
          { new: true }
        ).then((updatedUser) => {
          return Family.findByIdAndUpdate(
            updatedFamily._id,
            { surname: updatedFamily.surname + "-" + updatedUser.surname },
            { new: true }
          );
        });
      });
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;

      const user = { email, name, _id };

      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Introduzca su email y contraseña" });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "El usuario no existe" });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, name } = foundUser;

        const payload = { _id, email, name };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      }
    })
    .catch((err) => next(err));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(`req.payload`, req.payload);

  res.status(200).json(req.payload);
});

router.get("/:userId", (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate("family")
    .then((user) => res.status(200).json(user))
    .catch((err) => res.json(err));
});

router.put("/:userId", (req, res, next) => {
  const { userId } = req.params;
  const { name, surname, profilePic } = req.body;

  User.findByIdAndUpdate(userId, { name, surname, profilePic }, { new: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.json(err));
});

router.delete("/:userId", (req, res, next) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId)
    .then(() => res.status(200).json({ message: "User deleted" }))
    .then(() => {
      return Family.updateMany(
        { parents: userId },
        { $pull: { parents: userId } }
      );
    })
    .catch((err) => res.json(err));
});

module.exports = router;
