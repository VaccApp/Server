const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: [true, "El apellido es requerido."],
    },
    dni: {
      type: String,
      unique: true,
      required: [true, "El DNI es requerido."],
    },
    family: [{ type: Schema.Types.ObjectId, ref: "Family" }],
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/5348/5348883.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
