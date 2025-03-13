import axios from "axios";

const API_URL = "http://mern-todo-app-assignment.vercel.app/api/todos";

export const fetchTodos = async () => axios.get(API_URL);
export const addTodo = async (todo) => axios.post(API_URL, todo);
export const updateTodo = async (id) => axios.put(`${API_URL}/${id}`);
export const reorderTodos = async (updatedTodos) => axios.put(`${API_URL}/reorder`, { updatedTodos });
