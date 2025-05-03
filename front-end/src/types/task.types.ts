export enum Priority {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export type TaskType = {
  id: string;
  label: string;
  priority: Priority;
  dueTime: Date;
  done: boolean;
}

export interface TaskContextType {
  tasks: TaskType[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (taskInput: TaskType) => Promise<void>;
  updateTask: (id: string, taskInput: Partial<TaskType>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}