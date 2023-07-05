const { Schema, model } = require("mongoose");

const vaccineSchema = new Schema(
  {
    name: {
      type: String,
      required: [false, "Nombre de la vacuna requerido."],
    },
    dose: {
      type: Number,
      required: [false, "Dosis requeridas."],
    },
    disease: {
      type: String,
      required: [false, "Enfermedad que combate requerida."],
    },
    creator: {
      type: String,
      required: [false, "Fabricante requerido"],
    },
    expires: {
      type: Date,
      required: [false, "La fecha de caducidad es necesaria"],
    },
    batch: {
      type: String,
      required: [false, "El número de lote es necesario."],
    },
    status: {
      type: String,
      enum: ["PENDIENTE", "PROGRAMADA", "PUESTA"],
      default: "PENDIENTE",
    },
    // vaccinationAge: {
    //   type: Number,
    // },
  },
  {
    timestamps: true,
  }
);

const Vaccine = model("Vaccine", vaccineSchema);

module.exports = Vaccine;
