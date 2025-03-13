import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API_URL = "http://mern-todo-app-assignment.vercel.app/api/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // Fetch todos from the backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(API_URL);
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error.message);
      }
    };
    fetchTodos();
  }, []);

  // Handle drag-and-drop functionality
  const onDragEnd = async (result) => {
    if (!result.destination) return;
  
    const reorderedTodos = [...todos];
    const [movedItem] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, movedItem);
  
    setTodos(reorderedTodos);
  
    try {
      await axios.put("http://mern-todo-app-assignment.vercel.app/api/todos/reorder", { todos }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures request is accepted by CORS
      });
    } catch (error) {
      console.error("Error updating todo order:", error);
      alert("Failed to update task order. Check network connection.");
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {}}
                    />
                    <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                      {todo.title}
                    </span>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;

