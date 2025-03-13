const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend to access backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());


// MongoDB Connection
mongoose.connect("mongodb+srv://shailbalatannu20:DhnxqycTs4ssHKeu@cluster0.hkqae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


// Define Schema & Model
const todoSchema = new mongoose.Schema({
  title: String,
  link: String,
  completed: Boolean,
  position: Number,
});

const Todo = mongoose.model("Todo", todoSchema);

// 📌 Fetch Todos (Sorted by Position)
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ position: 1 });
  res.json(todos);
});

// 📌 Add a New Todo
app.post("/api/todos", async (req, res) => {
  const { title, link } = req.body;
  const count = await Todo.countDocuments();
  const newTodo = new Todo({ title, link, completed: false, position: count });
  await newTodo.save();
  res.json(newTodo);
});

// 📌 Mark Todo as Complete/Incomplete
app.put("/api/todos/:id", async (req, res) => {
  const { completed } = req.body;
  await Todo.findByIdAndUpdate(req.params.id, { completed });
  res.sendStatus(200);
});

// 📌 Update Todo Order (Drag & Drop)
// app.put("/api/todos/reorder", async (req, res) => {
//   const { todos } = req.body;
//   for (let i = 0; i < todos.length; i++) {
//     await Todo.findByIdAndUpdate(todos[i]._id, { position: i });
//   }
//   res.sendStatus(200);
// });
app.put("/api/todos/reorder", async (req, res) => {
  try {
    const { todos } = req.body;
    for (let i = 0; i < todos.length; i++) {
      await Todo.findByIdAndUpdate(todos[i]._id, { position: i });
    }
    res.json({ message: "Reorder successful" }); // ✅ Send JSON response
  } catch (error) {
    res.status(500).json({ error: "Error updating order" }); // ✅ Handle errors
  }
});


// 📌 Delete Todo
app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});
process.on("uncaughtException", (err) => {
  console.error("Unhandled Error:", err);
});

app.listen(5000, () => console.log("Server running on port 5000"));
