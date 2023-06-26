const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const familySchema = new Schema(
  {
    surname: {
      type: String,
      required: [true, "Apellido de la familia necesario."],
    },
    parents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    children: [{ type: Schema.Types.ObjectId, ref: "Child" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Family", familySchema);
