const { Schema, model } = require("mongoose");

const vaccineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nombre de la vacuna requerido."],
    },
    dose: {
      type: Number,
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
