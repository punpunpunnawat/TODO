import React, { useState, useEffect, ReactNode } from 'react';
import { TaskContext } from './TaskContext';
import { Priority, TaskType } from '../../types/task.types';

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:8080/tasks';

  const normalizePriority = (p: Priority): Priority => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Priority[p as keyof typeof Priority];
    return Priority.MEDIUM; // fallback default
  };
  
  

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
  
      const formatted = data.map((task: TaskType) => {
        const dueTime = task.dueTime ? new Date(task.dueTime) : null;
        const completeTime = task.completeTime ? new Date(task.completeTime) : null;
        const deleteTime = task.deleteTime ? new Date(task.deleteTime) : null;
        return {
          ...task,
          dueTime: dueTime instanceof Date && !isNaN(dueTime.getTime()) ? dueTime : null,
          completeTime: completeTime instanceof Date && !isNaN(completeTime.getTime()) ? completeTime : null,
          deleteTime: deleteTime instanceof Date && !isNaN(deleteTime.getTime()) ? deleteTime : null,
          priority: normalizePriority(task.priority),
        };
      });
      
      setTasks(formatted);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };
  

  // Call fetchTasks only once on mount
  useEffect(() => {
    fetchTasks();
    console.log(tasks)
  }, []); // empty dependency array ensures it runs only once on mount

  // Helper function to format dueTime and priority
const formatTaskFields = (taskInput: Partial<TaskType>) => {
  const taskToSend: Record<string, unknown> = { ...taskInput };

  // Convert Date object to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
  if (taskInput.dueTime instanceof Date) {
    taskToSend.dueTime = formatTime(taskInput.dueTime);
  }

  if (taskInput.completeTime instanceof Date) {
    taskToSend.completeTime = formatTime(taskInput.completeTime);
  }

  if (taskInput.deleteTime instanceof Date) {
    taskToSend.deleteTime = formatTime(taskInput.deleteTime);
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
    const taskToSend = formatTaskFields(taskInput); // Use the consolidated function

    console.log("POST payload:", taskToSend); // Log the data you're sending

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskToSend),
    });

    if (!res.ok) throw new Error('Failed to add task');
    await fetchTasks(); // re-fetch tasks after adding
  } catch (err) {
    console.error(err);
    setError('Failed to add task');
  }
};

// Usage in updateTask
const updateTask = async (id: string, taskInput: Partial<TaskType>) => {
  const taskToSend = formatTaskFields(taskInput); // Use the consolidated function

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskToSend),
    });
    if (!res.ok) throw new Error('Failed to update task');
    await fetchTasks();
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
