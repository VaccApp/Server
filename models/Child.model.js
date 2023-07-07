const { Schema, model } = require("mongoose");

const childSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El campo nombre es requerido."],
    },
    birthdate: {
      type: Date,
      required: [false, "La fecha de nacimiento no es obligatoria."],
    },
    healthcard: {
      type: String,
      required: [true, "La tarjeta sanitaria es obligatoria"],
    },
    family: { type: Schema.Types.ObjectId, ref: "Family" },
    vaccines: [{ type: Schema.Types.ObjectId, ref: "Vaccine" }],
  },
  {
    timestamps: true,
  }
);

const Child = model("Child", childSchema);

module.exports = Child;
