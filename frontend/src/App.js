import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  // 📌 Fetch Todos
  const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:5000/api/todos");
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 📌 Add Todo
  const addTodo = async () => {
    if (!title.trim()) return;
    await axios.post("http://localhost:5000/api/todos", { title, link });
    setTitle("");
    setLink("");
    fetchTodos();
  };

  // 📌 Toggle Complete
  const toggleComplete = async (id, completed) => {
    await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed });
    fetchTodos();
  };

  // 📌 Handle Drag & Drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const updatedTodos = [...todos];
    const [movedItem] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, movedItem);

    setTodos(updatedTodos);
    await axios.put("http://localhost:5000/api/todos/reorder", { todos }, {
        headers: { "Content-Type": "application/json" }
      });
      
  };

  // 📌 Delete Todo
  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos();
  };

  return (
    <div style={{ width: "400px", margin: "auto", textAlign: "center" }}>
      <h1>To-Do Dashboard</h1>

      {/* 📌 Input Form */}
      <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Task Link" value={link} onChange={(e) => setLink(e.target.value)} />
      <button onClick={addTodo}>Add</button>

      {/* 📌 Drag & Drop List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} style={{ padding: 0 }}>
              {todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ display: "flex", alignItems: "center", padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo._id, todo.completed)} />
                      <span style={{ textDecoration: todo.completed ? "line-through" : "none", marginLeft: "10px" }}>
                        <a href={todo.link} target="_blank" rel="noopener noreferrer">{todo.title}</a>
                      </span>
                      <button onClick={() => deleteTodo(todo._id)} style={{ marginLeft: "auto", color: "red" }}>X</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
