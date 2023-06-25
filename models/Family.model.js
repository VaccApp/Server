const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    surname: {
      type: String,
      required: [true, "Apellido de la familia necesario."],
    },
    parents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    children: [{ type: Schema.Types.ObjectId, ref: "Child" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Family = model("Family", userSchema);

module.exports = Family;
