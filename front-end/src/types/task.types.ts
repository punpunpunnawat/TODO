export enum Priority {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export interface TaskType {
  id: string;
  label: string;
  priority: Priority;
  completed: boolean;
  deleted: boolean;
  dueDate: Date | null;
  completedDate: Date | null;
  deletedDate: Date | null;
  createdDate: Date | null;
}


export interface TaskContextType {
  tasks: TaskType[];
  loading: boolean;
  error: string | null;
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  fetchTasks: () => Promise<void>;
  addTask: (taskInput: TaskType) => Promise<void>;
  updateTask: (id: string, taskInput: Partial<TaskType>) => Promise<void>;
}

export interface GlobalContextType {
  userID: string;
  userEmail: string;
  darkModeActive: boolean;
  loggedIn: boolean;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  setDarkModeActive: (value: boolean) => void;
}

