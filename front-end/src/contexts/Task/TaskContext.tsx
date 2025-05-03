// src/context/TaskContext.ts
import { createContext } from 'react';
import { TaskContextType } from '../../types/task.types';

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
