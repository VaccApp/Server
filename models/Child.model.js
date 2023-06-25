const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El campo nombre es requerido."],
    },
    birthDate: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria."],
    },
    family: [{ type: Schema.Types.ObjectId, ref: "Family" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Child = model("Child", userSchema);

module.exports = Child;
