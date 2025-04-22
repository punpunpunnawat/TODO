export enum Priority {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export type TaskType = {
  id: number;
  label: string;
  priority: Priority;
  date: string;
  time: string;
  done: boolean;
}
