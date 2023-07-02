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

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
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
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }); // In this case, we send error handling to the error handling middleware.
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

  // Check the users collection if a user with the same email already exists

  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "El usuario ya existe." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
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
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

module.exports = router;
