const { Schema, model } = require("mongoose");

const vaccineSchema = new Schema(
  {
    name: {
      type: String,
      default: "Nombre",
    },
    dose: {
      type: Number,
      default: 3,
    },
    disease: {
      type: String,
      default: "Enfermedad",
    },
    creator: {
      type: String,
      default: "Fabricante",
    },
    expires: {
      type: Date,
      default: "2024-07-14T17:28:04",
    },
    batch: {
      type: String,
      default: "1r0n71r0n",
    },
    status: {
      type: String,
      enum: ["PENDIENTE", "PROGRAMADA", "PUESTA"],
      default: "PENDIENTE",
    },
    vaccinationDate: {
      type: Date,
      default: "2024-07-14T17:28:04",
    },
    vaccinationAge: {
      type: Number,
      default: 99,
    },
    center: {
      type: String,
      default: "Centro de vacunación",
    },
  },
  {
    timestamps: true,
  }
);

const Vaccine = model("Vaccine", vaccineSchema);

module.exports = Vaccine;
