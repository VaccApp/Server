const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nombre de la vacuna requerido."],
      unique: true,
    },
    dose: {
      type: String,
      required: [true, "Dosis requeridas."],
    },
    disease: {
      type: String,
      required: [true, "Enfermedad que combate requerida."],
    },
    creator: {
      type: String,
      required: [true, "Fabricante requerido"],
    },
    expires: {
      type: Date,
      required: [true, "La fecha de caducidad es necesaria"],
    },
    batch: {
      type: String,
      required: [true, "El número de lote es necesario."],
    },
  },
  {
    timestamps: true,
  }
);

const Vaccine = model("Vacuna", userSchema);

module.exports = Vaccine;
