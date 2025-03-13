const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ position: 1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Update order of todos (Reordering)
router.post("/reorder", async (req, res) => {
  try {
    const { todos } = req.body;

    // Update each todo's position in the database
    const bulkOps = todos.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { position: index },
      },
    }));

    await Todo.bulkWrite(bulkOps);
    res.json({ success: true, message: "Todos reordered successfully!" });
  } catch (error) {
    console.error("Reordering Error:", error);
    res.status(500).json({ error: "Failed to reorder todos" });
  }
});

module.exports = router;
