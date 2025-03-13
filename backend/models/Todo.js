const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String },
    completed: { type: Boolean, default: false },
    position: { type: Number, required: true }
});

module.exports = mongoose.model("Todo", todoSchema);
