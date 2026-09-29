const mongoose = require("mongoose");

const tempRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
role: {
  type: String,
  enum: ["user", "artist", "admin"],
  default: "user"
},
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TempRegistration",
  tempRegistrationSchema
);