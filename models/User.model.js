const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
    },
    name: {
      type: String,
      required: [true, "El nombre es requerido."],
    },
    dni: {
      type: String,
      required: [true, "El DNI es requerido."],
    },

    families: [{ type: Schema.Types.ObjectId, ref: "Family" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
