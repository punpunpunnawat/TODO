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
  
        return {
          ...task,
          dueTime: dueTime instanceof Date && !isNaN(dueTime.getTime()) ? dueTime : null,
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
  }, []); // empty dependency array ensures it runs only once on mount

  // Methods for adding, updating, and deleting tasks
  const addTask = async (taskInput: TaskType) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskInput),
      });
      if (!res.ok) throw new Error('Failed to add task');
      await fetchTasks(); // re-fetch tasks after adding
    } catch (err) {
      console.error(err);
      setError('Failed to add task');
    }
  };

  const updateTask = async (id: string, taskInput: Partial<TaskType>) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskInput),
      });
      if (!res.ok) throw new Error('Failed to update task');
      await fetchTasks(); // re-fetch tasks after updating
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
