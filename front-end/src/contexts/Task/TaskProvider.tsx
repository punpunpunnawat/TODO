import React, { useState, useEffect, ReactNode } from "react";
import { TaskContext } from "./TaskContext";
import { Priority, TaskType } from "../../types/task.types";
import useGlobal from "../../hooks/useGlobal";

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { userID } = useGlobal();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = `http://localhost:8080/`;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}tasks?user_id=${userID}`);
      const data = await res.json();
      const formatted = data.map((task: TaskType) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const completedDate = task.completedDate
          ? new Date(task.completedDate)
          : null;
        const deletedDate = task.deletedDate
          ? new Date(task.deletedDate)
          : null;
        const createdDate = task.createdDate
          ? new Date(task.createdDate)
          : null;
        return {
          ...task,
          dueDate:
            dueDate instanceof Date && !isNaN(dueDate.getTime())
              ? dueDate
              : null,
          completedDate:
            completedDate instanceof Date && !isNaN(completedDate.getTime())
              ? completedDate
              : null,
          deletedDate:
            deletedDate instanceof Date && !isNaN(deletedDate.getTime())
              ? deletedDate
              : null,
          createDate:
            createdDate instanceof Date && !isNaN(createdDate.getTime())
              ? createdDate
              : null,
          priority: normalizePriority(task.priority),
        };
      });
      setTasks(formatted);
      console.log(formatted);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const normalizePriority = (p: Priority): Priority => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Priority[p as keyof typeof Priority];
    return Priority.MEDIUM;
  };

  useEffect(() => {
    fetchTasks();
    console.log(tasks);
  }, [userID]);

  // Helper function to format dueDate and priority
  const formatDateToString = (taskInput: Partial<TaskType>) => {
    const taskToSend: Record<string, unknown> = { ...taskInput };

    // Convert Date object to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
    if (taskInput.dueDate instanceof Date) {
      taskToSend.dueDate = formatTime(taskInput.dueDate);
    }

    if (taskInput.completedDate instanceof Date) {
      taskToSend.completedDate = formatTime(taskInput.completedDate);
    }

    if (taskInput.deletedDate instanceof Date) {
      taskToSend.deletedDate = formatTime(taskInput.deletedDate);
    }

    // Ensure priority is a string ('HIGH', etc.)
    if (typeof taskInput.priority === "number") {
      taskToSend.priority = Priority[taskInput.priority];
    }

    return taskToSend;
  };

  //format Date as YYYY-MM-DD HH:MM:SS
  const formatTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const addTask = async (taskInput: TaskType) => {
    try {
      const taskToSend = formatDateToString(taskInput);
      const res = await fetch(`${API_URL}tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!res.ok) throw new Error("Failed to add task");
      setTasks((prevTasks) => [...prevTasks, taskInput]);
    } catch (err) {
      console.error(err);
      setError("Failed to add task");
    }
  };

  const updateTask = async (id: string, taskInput: Partial<TaskType>) => {
    const taskToSend = formatDateToString(taskInput); // Format task fields for backend

    try {
      const res = await fetch(`${API_URL}tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!res.ok) throw new Error("Failed to update task");

      console.log(":)");
      // Update local state inside the provider
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...taskInput } : task
        )
      );

      setError(null); // Reset any previous errors
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");

      // Update local state instead of full refresh
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        setTasks,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
