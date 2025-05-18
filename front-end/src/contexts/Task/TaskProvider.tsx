import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { TaskContext } from "./TaskContext";
import { Priority, TaskType } from "../../types/task.types";
import useGlobal from "../../hooks/useGlobal";

interface TaskProviderProps {
  children: ReactNode;
}

type RawTaskType = Omit<
  TaskType,
  "dueDate" | "completedDate" | "deletedDate" | "createdDate"
> & {
  dueDate: string | null;
  completedDate: string | null;
  deletedDate: string | null;
  createdDate: string | null;
};

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { userID, loggedIn } = useGlobal();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "http://localhost:8080/";

  const normalizePriority = (p: Priority): Priority => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Priority[p as keyof typeof Priority];
    return Priority.MEDIUM;
  };

  const parseDate = (date: string | null) => {
    const parsed = date ? new Date(date) : null;
    return parsed instanceof Date && !isNaN(parsed.getTime()) ? parsed : null;
  };

  const fetchTasks = useCallback(async () => {
    if (!userID || !loggedIn) return;

    console.log("Fetching tasks...");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}tasks?user_id=${userID}`);
      const data: RawTaskType[] = await res.json();

      const formatted: TaskType[] = data.map((task) => ({
        ...task,
        dueDate: parseDate(task.dueDate),
        completedDate: parseDate(task.completedDate),
        deletedDate: parseDate(task.deletedDate),
        createdDate: parseDate(task.createdDate),
        priority: normalizePriority(task.priority),
      }));

      setTasks(formatted);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [userID, loggedIn]);

  const formatDate = (taskInput: Partial<TaskType>) => {
    const taskToSend: Record<string, unknown> = { ...taskInput };

    const formatDateToString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    if (taskInput.dueDate instanceof Date) {
      taskToSend.dueDate = formatDateToString(taskInput.dueDate);
    }
    if (taskInput.completedDate instanceof Date) {
      taskToSend.completedDate = formatDateToString(taskInput.completedDate);
    }
    if (taskInput.deletedDate instanceof Date) {
      taskToSend.deletedDate = formatDateToString(taskInput.deletedDate);
    }
    if (typeof taskInput.priority === "number") {
      taskToSend.priority = Priority[taskInput.priority];
    }

    return taskToSend;
  };

  const addTask = async (taskInput: TaskType) => {
    try {
      const taskToSend = formatDate(taskInput);
      const res = await fetch(`${API_URL}tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!res.ok) throw new Error("Failed to add task");
      setTasks((prev) => [...prev, taskInput]);
    } catch (err) {
      console.error(err);
      setError("Failed to add task");
    }
  };

  const updateTask = async (id: string, taskInput: Partial<TaskType>) => {
    const taskToSend = formatDate(taskInput);

    try {
      const res = await fetch(`${API_URL}tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!res.ok) throw new Error("Failed to update task");

      // setTasks((prevTasks) =>
      //   prevTasks.map((task) =>
      //     task.id === id ? { ...task, ...taskInput } : task
      //   )
      // );
      fetchTasks();
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  // Fetch on login/userID change
  useEffect(() => {
    if (loggedIn && userID) {
      fetchTasks();
    } else {
      setTasks([]); // clear on logout
    }
  }, [loggedIn, userID, fetchTasks]);

  const contextValue = useMemo(
    () => ({
      tasks,
      loading,
      error,
      setTasks,
      fetchTasks,
      addTask,
      updateTask,
    }),
    [tasks, loading, error, fetchTasks]
  );

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};
