const { Schema, model } = require("mongoose");

const vaccineSchema = new Schema(
  {
    name: {
      type: String,
    },
    dose: {
      type: Number,
    },
    disease: {
      type: String,
    },
    creator: {
      type: String,
    },
    expires: {
      type: Date,
    },
    batch: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDIENTE", "PROGRAMADA", "PUESTA"],
      default: "PENDIENTE",
    },
    vaccinationDate: {
      type: Date,
    },
    vaccinationAge: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Vaccine = model("Vaccine", vaccineSchema);

module.exports = Vaccine;
