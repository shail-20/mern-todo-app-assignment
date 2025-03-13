import { useState } from "react";
// import { addTodo } from "./api";
import { addTodo } from "../components/api";

const TodoForm = ({ refreshTodos }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title) {
            await addTodo({ title });
            setTitle("");
            refreshTodos();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add Todo" />
            <button type="submit">Add</button>
        </form>
    );
};

export default TodoForm;
