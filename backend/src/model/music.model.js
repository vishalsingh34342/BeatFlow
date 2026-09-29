const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    audioUrl: {
      type: String,
      required: true
    },

    coverUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Music", musicSchema);