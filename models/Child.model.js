const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Child = model("Child", childSchema);

module.exports = Child;
