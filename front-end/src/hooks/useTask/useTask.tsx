import { useContext } from 'react';
import { TaskContextType } from '../../types/task.types';
import { TaskContext } from '../../contexts/Task/TaskContext';

const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default useTask;
