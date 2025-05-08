export enum Priority {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export interface TaskType {
  id: string;
  label: string;
  priority: Priority;
  dueDate: Date;
  completed: boolean;
  deleted: boolean;
  completedDate: Date;
  deletedDate: Date;
}


export interface TaskContextType {
  tasks: TaskType[];
  userID: string;
  loading: boolean;
  error: string | null;
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  fetchTasks: () => Promise<void>;
  addTask: (taskInput: TaskType) => Promise<void>;
  updateTask: (id: string, taskInput: Partial<TaskType>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
}
