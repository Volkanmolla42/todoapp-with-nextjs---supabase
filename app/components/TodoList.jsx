"use client";

import React, { useEffect, useState } from "react";
import {
  getTodos,
  addTodo,
  subscribeToTodosChanges,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation"; // Yönlendirme için eklenir

const TodoList = () => {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTodos = async () => {
      const todosData = await getTodos();
      setTodos(todosData);
    };

    fetchTodos();

    const subscription = subscribeToTodosChanges((payload) => {
      console.log("Veritabanı değişikliği:", payload);
      const { new: newTodo, old: oldTodo, eventType } = payload;

      if (eventType === "INSERT" && newTodo) {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      }

      if (eventType === "UPDATE" && newTodo) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === newTodo.id ? newTodo : todo))
        );
      }

      if (eventType === "DELETE" && oldTodo) {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo.id !== oldTodo.id)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddTodo = async () => {
    if (title) {
      await addTodo(title);
      setTitle("");
    }
  };

  const handleToggleComplete = async (todo) => {
    await updateTodo(todo.id, !todo.completed);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
  };

  return user ? (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        {user.email} için Todo List
      </h2>
      <button onClick={logout}>Çıkış Yap</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title) {
            handleAddTodo();
          }
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Add Todo
        </button>
      </form>
      <ul className="space-y-2">
        {todos
          .slice()
          .reverse()
          .map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-md"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className="h-5 w-5"
                />
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 border-red-200 border px-2"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  ) : (
    <p>Please wait...</p>
  );
};

export default TodoList;
