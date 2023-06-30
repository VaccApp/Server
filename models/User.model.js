const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      // lowercase: true,
      // trim: true,
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
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
