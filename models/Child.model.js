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
    childPic: {
      type: String,
      default: "https://cdn3.iconfinder.com/data/icons/materia-human/24/013_042_newborn_infant_child_baby-512.png",
    },
  },
  {
    timestamps: true,
  }
);

const Child = model("Child", childSchema);

module.exports = Child;
