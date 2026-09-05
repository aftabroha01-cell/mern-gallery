const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 80,
    default: "Untitled image",
  },
  description: {
    type: String,
    trim: true,
    maxlength: 240,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.length <= 5;
      },
      message: "A maximum of five tags is allowed.",
    },
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Image", imageSchema);