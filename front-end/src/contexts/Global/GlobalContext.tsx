import { createContext } from 'react';
import { GlobalContextType } from '../../types/task.types';

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
