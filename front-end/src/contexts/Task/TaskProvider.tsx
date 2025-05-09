import React, { useState, useEffect, ReactNode } from 'react';
import { TaskContext } from './TaskContext';
import { Priority, TaskType } from '../../types/task.types';
import useGlobal from '../../hooks/useGlobal';

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {

  const {userID} = useGlobal()
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const [userID, setUserID] = useState<string>("")

  // const API_URL = `http://localhost:8080/tasks?user_id=${encodeURIComponent(userID)}`;
  // const API_URL = `http://localhost:8080/tasks?user_id=test-user-id-001`;
  const API_URL = `http://localhost:8080/`;
  console.log(API_URL)
  console.log(tasks)
  const normalizePriority = (p: Priority): Priority => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Priority[p as keyof typeof Priority];
    return Priority.MEDIUM; // fallback default
  };

  const fetchTasks = async () => {
    setLoading(true);
    console.log("fetch api = "+`${API_URL}tasks?user_id=${userID}`)
    try {
      const res = await fetch(`${API_URL}tasks?user_id=${userID}`);
      const data = await res.json();
      const formatted = data.map((task: TaskType) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const completedDate = task.completedDate ? new Date(task.completedDate) : null;
        const deletedDate = task.deletedDate ? new Date(task.deletedDate) : null;
        const createDate = task.createDate ? new Date(task.createDate) : null;
        return {
          ...task,
          dueDate: dueDate instanceof Date && !isNaN(dueDate.getTime()) ? dueDate : null,
          completedDate: completedDate instanceof Date && !isNaN(completedDate.getTime()) ? completedDate : null,
          deletedDate: deletedDate instanceof Date && !isNaN(deletedDate.getTime()) ? deletedDate : null,
          createDate: createDate instanceof Date && !isNaN(createDate.getTime()) ? createDate : null,
          priority: normalizePriority(task.priority),
        };
      });
      setTasks(formatted);
      console.log(formatted)
      setError(null);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };
  
  console.log(tasks)

  useEffect(() => {
    fetchTasks();
    console.log(tasks)
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
  if (typeof taskInput.priority === 'number') {
    taskToSend.priority = Priority[taskInput.priority];
  }

  return taskToSend;
};

// Helper function to format Date as YYYY-MM-DD HH:MM:SS
const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Usage in addTask
const addTask = async (taskInput: TaskType) => {
  try {
    const taskToSend = formatDateToString(taskInput); // Use the consolidated function

    console.log("POST payload:", taskToSend); // Log the data you're sending

    const res = await fetch(`${API_URL}tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskToSend),
    });

    if (!res.ok) throw new Error('Failed to add task');
    setTasks(prevTasks => [...prevTasks, taskInput]);

  } catch (err) {
    console.error(err);
    setError('Failed to add task');
  }
};

const updateTask = async (id: string, taskInput: Partial<TaskType>) => {
  const taskToSend = formatDateToString(taskInput); // Format task fields for backend
  console.log(id)
  try {
    const res = await fetch(`${API_URL}tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskToSend),
    });

    console.log(`${API_URL}tasks/${id}`)
    if (!res.ok) throw new Error('Failed to update task');

    console.log(":)")
    // Update local state inside the provider
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...taskInput } : task))
    );

    setError(null); // Reset any previous errors

    } catch (err) {
      console.error(err);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
  
      // Update local state instead of full refresh
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
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
